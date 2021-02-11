"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const events_1 = require("events");
const net_1 = __importDefault(require("net"));
const Disconnect_1 = __importDefault(require("../packets/server/Disconnect"));
const HeartbeatAck_1 = __importDefault(require("../packets/server/HeartbeatAck"));
const ShardInfo_1 = __importDefault(require("../packets/server/ShardInfo"));
const Logger_1 = __importDefault(require("../util/Logger"));
const Session_1 = require("../util/Session");
const Crypto_1 = __importDefault(require("./Crypto"));
class Server extends events_1.EventEmitter {
    constructor(options) {
        super();
        this.options = options;
        this.onClose = () => {
            this.emit("close");
            this.server.off("close", this.onClose);
            this.server.off("connection", this.onConnection);
            this.server.off("error", this.onError);
            this.server.off("listening", this.onListening);
            clearInterval(this.heartbeatCheckInterval);
            clearInterval(this.shardDistributionInterval);
            for (const session of this.sessions) {
                if (!session.socket.destroyed)
                    session.socket.destroy();
            }
            this.initialize();
            this.start();
        };
        this.onConnection = (socket) => {
            const crypto = new Crypto_1.default(this.options.secretKey);
            const session = new Session_1.ServerSession(this.options.token, socket, crypto, this.options.disableEncryption);
            session.server = this;
            this.sessions.push(session);
            crypto.session = session;
            socket.on("data", async (data) => {
                await session.handlePacket(data);
            });
            socket.on("error", (err) => {
                Logger_1.default.error("SocketShard Server client error", err);
            });
            socket.on("close", () => {
                this.sessions.splice(this.sessions.indexOf(session), 1);
                if (session) {
                    this.emit("clientDisconnected", session);
                }
            });
            socket.on("end", () => {
                this.sessions.splice(this.sessions.indexOf(session), 1);
                if (session) {
                    this.emit("clientDisconnected", session);
                }
            });
            this.emit("connection", session);
        };
        this.onError = (err) => {
            Logger_1.default.error("SocketShard Server error", err);
        };
        this.heartbeatCheck = () => {
            for (const session of this.sessions) {
                if (!session.loggedIn)
                    return;
                const secondsSinceLastHeartbeat = (Date.now() - (session === null || session === void 0 ? void 0 : session.lastHeartbeat)) / 1000;
                if (secondsSinceLastHeartbeat >= 30) {
                    Logger_1.default.error(`Disconnecting ${session.socket.remoteAddress}:${session.socket.remotePort} as the last heartbeat was received more than ${secondsSinceLastHeartbeat} seconds ago.`);
                    session.socket.destroy();
                    this.sessions.splice(this.sessions.indexOf(session), 1);
                    if (session) {
                        this.emit("clientDisconnected", session);
                    }
                }
                else if (secondsSinceLastHeartbeat >= 10) {
                    Logger_1.default.warn(`The last heartbeat from ${session.socket.remoteAddress}:${session.socket.remotePort} was received more than ${secondsSinceLastHeartbeat} seconds ago.`);
                }
                session.sendPacket(new HeartbeatAck_1.default());
            }
        };
        this.shardDistribution = () => {
            if (this.latestShardInfoSendTime + 5000 > Date.now())
                return;
            const sessionArray = Array.from(this.sessions.values());
            for (const session of sessionArray) {
                if (sessionArray.filter((x) => x.shardIds.length).every((x) => x.ready)) {
                    if (session.loggedIn && session.maxShardCount) {
                        if (!session.shardIds.length) {
                            if (this.connectedShardIds.length >= this.options.shardCount) {
                                const disconnectPacket = new Disconnect_1.default();
                                disconnectPacket.code = 2;
                                disconnectPacket.message = "No more shards needed";
                                session.sendPacket(disconnectPacket);
                            }
                            const shardInfoPacket = new ShardInfo_1.default();
                            shardInfoPacket.shardCount = this.options.shardCount;
                            shardInfoPacket.shardIds = this.getNextShardIds(session.maxShardCount);
                            session.shardIds = shardInfoPacket.shardIds;
                            this.emit("shardInfoSent", session, shardInfoPacket.shardIds);
                            session.sendPacket(shardInfoPacket);
                            session.shardInfoSentAt = Date.now();
                            break;
                        }
                    }
                }
            }
        };
        this.onListening = () => {
            this.emit("listening");
            this.heartbeatCheckInterval = setInterval(this.heartbeatCheck, 5000);
            this.shardDistributionInterval = setInterval(this.shardDistribution, 100);
        };
        options.disableEncryption = options.disableEncryption || false;
        if (!options.secretKey && !options.disableEncryption) {
            throw new Error("Secret Key is required for encryption.");
        }
        options.port = options.port || 5252;
        options.hostname = options.hostname || "0.0.0.0";
        this.initialize();
    }
    start() {
        this.server.listen(this.options.port, this.options.hostname);
    }
    initialize() {
        this.sessions = [];
        this.server = new net_1.default.Server();
        this.server.on("close", this.onClose);
        this.server.on("connection", this.onConnection);
        this.server.on("error", this.onError);
        this.server.on("listening", this.onListening);
    }
    getNextShardIds(maxCount) {
        const shardIds = [];
        for (let i = 0; i < this.options.shardCount; i++) {
            if (shardIds.length >= maxCount)
                break;
            if (!this.sessions.some((x) => x.shardIds.includes(i))) {
                shardIds.push(i);
            }
        }
        return shardIds;
    }
    get latestShardInfoSendTime() {
        var _a;
        return (_a = this.sessions.sort((x, y) => y.shardInfoSentAt - x.shardInfoSentAt)[0]) === null || _a === void 0 ? void 0 : _a.shardInfoSentAt;
    }
    get connectedShardIds() {
        return this.sessions.map((x) => x.shardIds).flat();
    }
    get disconnectedShardIds() {
        return new Array(this.options.shardCount)
            .fill(1)
            .map((_x, i) => i)
            .filter((x) => !this.connectedShardIds.includes(x));
    }
}
exports.Server = Server;
exports.default = Server;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL3NlcnZlci9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxtQ0FBc0M7QUFDdEMsOENBQXNCO0FBQ3RCLDhFQUE0RDtBQUM1RCxrRkFBZ0U7QUFDaEUsNEVBQTBEO0FBQzFELDREQUFvQztBQUNwQyw2Q0FBZ0Q7QUFDaEQsc0RBQW9DO0FBcUZwQyxNQUFhLE1BQU8sU0FBUSxxQkFBWTtJQU90QyxZQUFtQixPQUFzQjtRQUN2QyxLQUFLLEVBQUUsQ0FBQztRQURTLFlBQU8sR0FBUCxPQUFPLENBQWU7UUF5QmpDLFlBQU8sR0FBRyxHQUFHLEVBQUU7WUFDckIsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNuQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3ZDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDakQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN2QyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQy9DLGFBQWEsQ0FBQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsQ0FBQztZQUMzQyxhQUFhLENBQUMsSUFBSSxDQUFDLHlCQUF5QixDQUFDLENBQUM7WUFDOUMsS0FBSyxNQUFNLE9BQU8sSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO2dCQUNuQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxTQUFTO29CQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7YUFDekQ7WUFDRCxJ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