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
                if (sessionArray
                    .filter((x) => x !== session && x.shardIds.length)
                    .every((x) => x.ready)) {
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