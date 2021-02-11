import { EventEmitter } from "events";
import net from "net";
import DisconnectPacket from "../packets/server/Disconnect";
import HeartbeatAckPacket from "../packets/server/HeartbeatAck";
import ShardInfoPacket from "../packets/server/ShardInfo";
import Logger from "../util/Logger";
import { ServerSession } from "../util/Session";
import ServerCrypto from "./Crypto";
export class Server extends EventEmitter {
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
            const crypto = new ServerCrypto(this.options.secretKey);
            const session = new ServerSession(this.options.token, socket, crypto, this.options.disableEncryption);
            session.server = this;
            this.sessions.push(session);
            crypto.session = session;
            socket.on("data", async (data) => {
                await session.handlePacket(data);
            });
            socket.on("error", (err) => {
                Logger.error("SocketShard Server client error", err);
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
            Logger.error("SocketShard Server error", err);
        };
        this.heartbeatCheck = () => {
            for (const session of this.sessions) {
                if (!session.loggedIn)
                    return;
                const secondsSinceLastHeartbeat = (Date.now() - session?.lastHeartbeat) / 1000;
                if (secondsSinceLastHeartbeat >= 30) {
                    Logger.error(`Disconnecting ${session.socket.remoteAddress}:${session.socket.remotePort} as the last heartbeat was received more than ${secondsSinceLastHeartbeat} seconds ago.`);
                    session.socket.destroy();
                    this.sessions.splice(this.sessions.indexOf(session), 1);
                    if (session) {
                        this.emit("clientDisconnected", session);
                    }
                }
                else if (secondsSinceLastHeartbeat >= 10) {
                    Logger.warn(`The last heartbeat from ${session.socket.remoteAddress}:${session.socket.remotePort} was received more than ${secondsSinceLastHeartbeat} seconds ago.`);
                }
                session.sendPacket(new HeartbeatAckPacket());
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
                                const disconnectPacket = new DisconnectPacket();
                                disconnectPacket.code = 2;
                                disconnectPacket.message = "No more shards needed";
                                session.sendPacket(disconnectPacket);
                            }
                            const shardInfoPacket = new ShardInfoPacket();
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
        this.server = new net.Server();
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
        return this.sessions.sort((x, y) => y.shardInfoSentAt - x.shardInfoSentAt)[0]?.shardInfoSentAt;
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
export default Server;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL3NlcnZlci9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sUUFBUSxDQUFDO0FBQ3RDLE9BQU8sR0FBRyxNQUFNLEtBQUssQ0FBQztBQUN0QixPQUFPLGdCQUFnQixNQUFNLDhCQUE4QixDQUFDO0FBQzVELE9BQU8sa0JBQWtCLE1BQU0sZ0NBQWdDLENBQUM7QUFDaEUsT0FBTyxlQUFlLE1BQU0sNkJBQTZCLENBQUM7QUFDMUQsT0FBTyxNQUFNLE1BQU0sZ0JBQWdCLENBQUM7QUFDcEMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ2hELE9BQU8sWUFBWSxNQUFNLFVBQVUsQ0FBQztBQXFGcEMsTUFBTSxPQUFPLE1BQU8sU0FBUSxZQUFZO0lBT3RDLFlBQW1CLE9BQXNCO1FBQ3ZDLEtBQUssRUFBRSxDQUFDO1FBRFMsWUFBTyxHQUFQLE9BQU8sQ0FBZTtRQXlCakMsWUFBTyxHQUFHLEdBQUcsRUFBRTtZQUNyQixJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ25CLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDdkMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUNqRCxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3ZDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDL0MsYUFBYSxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1lBQzNDLGFB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