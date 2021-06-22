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
                const sessionIndex = this.sessions.indexOf(session);
                if (sessionIndex >= 0) {
                    this.sessions.splice(this.sessions.indexOf(session), 1);
                    if (session) {
                        this.emit("clientDisconnected", session);
                    }
                }
            });
            socket.on("end", () => {
                const sessionIndex = this.sessions.indexOf(session);
                if (sessionIndex >= 0) {
                    this.sessions.splice(this.sessions.indexOf(session), 1);
                    if (session) {
                        this.emit("clientDisconnected", session);
                    }
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
                if (sessionArray
                    .filter((x) => x !== session && x.shardIds.length)
                    .every((x) => x.ready)) {
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
            this.shardDistributionInterval = setInterval(this.shardDistribution, 2000);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL3NlcnZlci9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxtQ0FBc0M7QUFDdEMsOENBQXNCO0FBQ3RCLDhFQUE0RDtBQUM1RCxrRkFBZ0U7QUFDaEUsNEVBQTBEO0FBQzFELDREQUFvQztBQUNwQyw2Q0FBZ0Q7QUFDaEQsc0RBQW9DO0FBcUZwQyxNQUFhLE1BQU8sU0FBUSxxQkFBWTtJQU90QyxZQUFtQixPQUFzQjtRQUN2QyxLQUFLLEVBQUUsQ0FBQztRQURTLFlBQU8sR0FBUCxPQUFPLENBQWU7UUF5QmpDLFlBQU8sR0FBRyxHQUFHLEVBQUU7WUFDckIsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNuQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3ZDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDakQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN2QyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQy9DLGFBQWEsQ0FBQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsQ0FBQztZQUMzQyxhQUFhLENBQUMsSUFBSSxDQUFDLHlCQUF5QixDQUFDLENBQUM7WUFDOUMsS0FBSyxNQUFNLE9BQU8sSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO2dCQUNuQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxTQUFTO29CQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7YUFDekQ7WUFDRCxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDbEIsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ2YsQ0FBQyxDQUFDO1FBRU0saUJBQVksR0FBRyxDQUFDLE1BQWtCLEVBQUUsRUFBRTtZQUM1QyxNQUFNLE1BQU0sR0FBRyxJQUFJLGdCQUFZLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUN4RCxNQUFNLE9BQU8sR0FBRyxJQUFJLHVCQUFhLENBQy9CLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUNsQixNQUFNLEVBQ04sTUFBTSxFQUNOLElBQUksQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQy9CLENBQUM7WUFDRixPQUFPLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztZQUN0QixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUM1QixNQUFNLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztZQUN6QixNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUU7Z0JBQy9CLE1BQU0sT0FBTyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNuQyxDQUFDLENBQUMsQ0FBQztZQUNILE1BQU0sQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUU7Z0JBQ3pCLGdCQUFNLENBQUMsS0FBSyxDQUFDLGlDQUFpQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ3ZELENBQUMsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFO2dCQUN0QixNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDcEQsSUFBSSxZQUFZLElBQUksQ0FBQyxFQUFFO29CQUNyQixJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDeEQsSUFBSSxPQUFPLEVBQUU7d0JBQ1gsSUFBSSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxPQUFPLENBQUMsQ0FBQztxQkFDMUM7aUJBQ0Y7WUFDSCxDQUFDLENBQUMsQ0FBQztZQUNILE1BQU0sQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRTtnQkFDcEIsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ3BELElBQUksWUFBWSxJQUFJLENBQUMsRUFBRTtvQkFDckIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQ3hELElBQUksT0FBTyxFQUFFO3dCQUNYLElBQUksQ0FBQyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsT0FBTyxDQUFDLENBQUM7cUJBQzFDO2lCQUNGO1lBQ0gsQ0FBQyxDQUFDLENBQUM7WUFDSCxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNuQyxDQUFDLENBQUM7UUFFTSxZQUFPLEdBQUcsQ0FBQyxHQUFVLEVBQUUsRUFBRTtZQUMvQixnQkFBTSxDQUFDLEtBQUssQ0FBQywwQkFBMEIsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNoRCxDQUFDLENBQUM7UUFtQk0sbUJBQWMsR0FBRyxHQUFHLEVBQUU7WUFDNUIsS0FBSyxNQUFNLE9BQU8sSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO2dCQUNuQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVE7b0JBQUUsT0FBTztnQkFDOUIsTUFBTSx5QkFBeUIsR0FDN0IsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUcsT0FBTyxhQUFQLE9BQU8sdUJBQVAsT0FBTyxDQUFFLGFBQWEsQ0FBQSxDQUFDLEdBQUcsSUFBSSxDQUFDO2dCQUMvQyxJQUFJLHlCQUF5QixJQUFJLEVBQUUsRUFBRTtvQkFDbkMsZ0JBQU0sQ0FBQyxLQUFLLENBQ1YsaUJBQWlCLE9BQU8sQ0FBQyxNQUFNLENBQUMsYUFBYSxJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsVUFBVSxpREFBaUQseUJBQXlCLGVBQWUsQ0FDcEssQ0FBQztvQkFDRixPQUFPLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO29CQUN6QixJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDeEQsSUFBSSxPQUFPLEVBQUU7d0JBQ1gsSUFBSSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxPQUFPLENBQUMsQ0FBQztxQkFDMUM7aUJBQ0Y7cUJBQU0sSUFBSSx5QkFBeUIsSUFBSSxFQUFFLEVBQUU7b0JBQzFDLGdCQUFNLENBQUMsSUFBSSxDQUNULDJCQUEyQixPQUFPLENBQUMsTUFBTSxDQUFDLGFBQWEsSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQVUsMkJBQTJCLHlCQUF5QixlQUFlLENBQ3hKLENBQUM7aUJBQ0g7Z0JBQ0QsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLHNCQUFrQixFQUFFLENBQUMsQ0FBQzthQUM5QztRQUNILENBQUMsQ0FBQztRQUVNLHNCQUFpQixHQUFHLEdBQUcsRUFBRTtZQUMvQixJQUFJLElBQUksQ0FBQyx1QkFBdUIsR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRTtnQkFBRSxPQUFPO1lBQzdELE1BQU0sWUFBWSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO1lBQ3hELEtBQUssTUFBTSxPQUFPLElBQUksWUFBWSxFQUFFO2dCQUNsQyxJQUNFLFlBQVk7cUJBQ1QsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEtBQUssT0FBTyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO3FCQUNqRCxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFDeEI7b0JBQ0EsSUFBSSxPQUFPLENBQUMsUUFBUSxJQUFJLE9BQU8sQ0FBQyxhQUFhLEVBQUU7d0JBQzdDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRTs0QkFDNUIsSUFBSSxJQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFO2dDQUM1RCxNQUFNLGdCQUFnQixHQUFHLElBQUksb0JBQWdCLEVBQUUsQ0FBQztnQ0FDaEQsZ0JBQWdCLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztnQ0FDMUIsZ0JBQWdCLENBQUMsT0FBTyxHQUFHLHVCQUF1QixDQUFDO2dDQUNuRCxPQUFPLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDLENBQUM7NkJBQ3RDOzRCQUNELE1BQU0sZUFBZSxHQUFHLElBQUksbUJBQWUsRUFBRSxDQUFDOzRCQUM5QyxlQUFlLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDOzRCQUNyRCxlQUFlLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQzdDLE9BQU8sQ0FBQyxhQUFhLENBQ3RCLENBQUM7NEJBQ0YsT0FBTyxDQUFDLFFBQVEsR0FBRyxlQUFlLENBQUMsUUFBUSxDQUFDOzRCQUM1QyxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxPQUFPLEVBQUUsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFDOzRCQUM5RCxPQUFPLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxDQUFDOzRCQUNwQyxPQUFPLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQzs0QkFDckMsTUFBTTt5QkFDUDtxQkFDRjtpQkFDRjthQUNGO1FBQ0gsQ0FBQyxDQUFDO1FBRU0sZ0JBQVcsR0FBRyxHQUFHLEVBQUU7WUFDekIsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUN2QixJQUFJLENBQUMsc0JBQXNCLEdBQUcsV0FBVyxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDckUsSUFBSSxDQUFDLHlCQUF5QixHQUFHLFdBQVcsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDN0UsQ0FBQyxDQUFDO1FBN0pBLE9BQU8sQ0FBQyxpQkFBaUIsR0FBRyxPQUFPLENBQUMsaUJBQWlCLElBQUksS0FBSyxDQUFDO1FBQy9ELElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxJQUFJLENBQUMsT0FBTyxDQUFDLGlCQUFpQixFQUFFO1lBQ3BELE1BQU0sSUFBSSxLQUFLLENBQUMsd0NBQXdDLENBQUMsQ0FBQztTQUMzRDtRQUVELE9BQU8sQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUM7UUFDcEMsT0FBTyxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxJQUFJLFNBQVMsQ0FBQztRQUNqRCxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDcEIsQ0FBQztJQUVELEtBQUs7UUFDSCxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQy9ELENBQUM7SUFFTyxVQUFVO1FBQ2hCLElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO1FBQ25CLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxhQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDL0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN0QyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ2hELElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDdEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBMkRPLGVBQWUsQ0FBQyxRQUFnQjtRQUN0QyxNQUFNLFFBQVEsR0FBRyxFQUFFLENBQUM7UUFDcEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ2hELElBQUksUUFBUSxDQUFDLE1BQU0sSUFBSSxRQUFRO2dCQUFFLE1BQU07WUFDdkMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO2dCQUN0RCxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ2xCO1NBQ0Y7UUFDRCxPQUFPLFFBQVEsQ0FBQztJQUNsQixDQUFDO0lBRUQsSUFBWSx1QkFBdUI7O1FBQ2pDLGFBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQ3ZCLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLGVBQWUsR0FBRyxDQUFDLENBQUMsZUFBZSxDQUNoRCxDQUFDLENBQUMsQ0FBQywwQ0FBRSxlQUFlLENBQUM7SUFDeEIsQ0FBQztJQWdFRCxJQUFJLGlCQUFpQjtRQUNuQixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDckQsQ0FBQztJQUVELElBQUksb0JBQW9CO1FBQ3RCLE9BQU8sSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUM7YUFDdEMsSUFBSSxDQUFDLENBQUMsQ0FBQzthQUNQLEdBQUcsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQzthQUNqQixNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3hELENBQUM7Q0FDRjtBQWxMRCx3QkFrTEM7QUFFRCxrQkFBZSxNQUFNLENBQUMifQ==