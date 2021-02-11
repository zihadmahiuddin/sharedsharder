import net from "net";
import { Client as DiscordClient, } from "discord.js";
import HandshakePacket from "../packets/client/Handshake";
import Logger from "../util/Logger";
import { ClientSession } from "../util/Session";
import ClientCrypto from "./Crypto";
import ShardReadyPacket from "../packets/client/ShardReady";
import BroadcastEvalPacket from "../packets/client/BroadcastEval";
import BroadcastEvalResultPacket from "../packets/server/BroadcastEvalResult";
import HeartbeatPacket from "../packets/client/Heartbeat";
import LoginOkPacket from "../packets/server/LoginOk";
export class Client extends DiscordClient {
    constructor(options) {
        super(options);
        this.wasClosed = false;
        this.onClose = () => {
            this.emit("connectionClosed");
            Logger.warn("SocketShard Client disconnected. Attempting to reconnect...");
            this.socket.off("close", this.onClose);
            this.socket.off("connect", this.onConnect);
            this.socket.off("data", this.onData);
            this.socket.off("error", this.onError);
            this.off("shardInfo", this.onShardInfo);
            clearInterval(this.heartbeatInterval);
            delete this.session;
            this.wasClosed = true;
            this.initialize();
            this.connect();
        };
        this.onConnect = () => {
            this.emit("connected");
            Logger.info(`Connected to ${this.socket.remoteAddress}:${this.socket.remotePort}!`);
            this.crypto = new ClientCrypto(Buffer.from(this.options.serverKey, "hex"));
            this.session = new ClientSession(this.socket, this.crypto, this.options.disableEncryption);
            this.session.client = this;
            this.crypto.session = this.session;
            const handshakePacket = new HandshakePacket();
            handshakePacket.maxShardCount = this.options.maxShardCount;
            this.session.sendPacket(handshakePacket);
            this.on("shardInfo", this.onShardInfo);
            this.session.on("packetReceived", this.onLoginOk);
            if (this.wasClosed) {
                this.wasClosed = false;
                this.login();
            }
        };
        this.onLoginOk = (packet) => {
            if (packet instanceof LoginOkPacket) {
                this.session.off("packetReceived", this.onLoginOk);
                setInterval(this.heartbeat, 5000);
            }
        };
        this.onData = async (data) => {
            await this.session.handlePacket(data);
        };
        this.onError = (err) => {
            Logger.error("SocketShard Client error", err);
        };
        this.onShardInfo = (shardInfo) => {
            this.shardCount = shardInfo[0];
            this.shardIds = shardInfo[1];
            this.session.shardCount = shardInfo[0];
            this.session.shardIds = shardInfo[1];
        };
        this.heartbeat = () => {
            const secondsSinceLastHeartbeat = (Date.now() - this.session?.lastHeartbeat) / 1000;
            if (secondsSinceLastHeartbeat >= 30) {
                Logger.error(`Last heartbeat ack was received more than ${secondsSinceLastHeartbeat} seconds ago. Exiting`);
                process.exit(1);
            }
            else if (secondsSinceLastHeartbeat >= 10) {
                Logger.warn(`Last heartbeat ack was received more than ${secondsSinceLastHeartbeat} seconds ago`);
            }
            this.session?.sendPacket(new HeartbeatPacket());
        };
        this.token = this.options.token || process.env.DISCORD_TOKEN;
        if (!this.token) {
            throw new Error("Discord token is required.");
        }
        this.options.sharedShardingEnabled =
            typeof this.options.sharedShardingEnabled === "undefined"
                ? true
                : this.options.sharedShardingEnabled;
        this.options.disableEncryption = options.disableEncryption || false;
        if (this.options.sharedShardingEnabled) {
            if (!this.options.serverKey && !this.options.disableEncryption) {
                throw new Error("Server Key is required for encryption.");
            }
            this.options.port = this.options.port || 5252;
            this.options.hostname = this.options.hostname || "127.0.0.1";
            this.options.maxShardCount = this.options.maxShardCount || 1;
            this.initialize();
        }
        else {
            this.options.shardCount = this.options.shardCount || 1;
            this.options.shardIds = this.options.shardIds || [0];
        }
    }
    connect() {
        this.socket.connect(this.options.port, this.options.hostname);
        return new Promise((r) => {
            this.once("connected", () => {
                r();
            });
        });
    }
    initialize() {
        this.socket = new net.Socket();
        this.socket.on("close", this.onClose);
        this.socket.on("connect", this.onConnect);
        this.socket.on("data", this.onData);
        this.socket.on("error", this.onError);
    }
    async login(token) {
        token = token || this.token;
        if (this.options.sharedShardingEnabled) {
            return new Promise(async (resolve) => {
                if (!this.session) {
                    await this.connect();
                }
                const loginInterval = setInterval(async () => {
                    if (this.session?.shardCount && this.session?.shardIds.length) {
                        clearInterval(loginInterval);
                        this.options.shardCount = this.session.shardCount;
                        this.options.shards = this.session.shardIds;
                        if (!this.readyTimestamp) {
                            resolve(await super.login(token));
                        }
                        else
                            resolve(token);
                        if (this.readyTimestamp) {
                            this.session.ready = true;
                            const shardReadyPacket = new ShardReadyPacket();
                            shardReadyPacket.shardIds = this.session.shardIds;
                            this.session.sendPacket(shardReadyPacket);
                        }
                        else {
                            this.once("ready", () => {
                                this.session.ready = true;
                                const shardReadyPacket = new ShardReadyPacket();
                                shardReadyPacket.shardIds = this.session.shardIds;
                                this.session.sendPacket(shardReadyPacket);
                            });
                        }
                    }
                }, 100);
            });
        }
        return super.login(token);
    }
    broadcastEval(code, timeout) {
        if (this.options.sharedShardingEnabled) {
            return new Promise((resolve, reject) => {
                if (this.session) {
                    const broadcastEvalPacket = new BroadcastEvalPacket();
                    broadcastEvalPacket.code = code;
                    broadcastEvalPacket.evalId = this.session.totalEvals++;
                    if (timeout)
                        broadcastEvalPacket.timeout = timeout;
                    this.session.sendPacket(broadcastEvalPacket);
                    const onResponse = (packet) => {
                        if (packet instanceof BroadcastEvalResultPacket) {
                            if (packet.evalId === broadcastEvalPacket.evalId) {
                                resolve(packet.responses);
                                this.session.off("packetReceived", onResponse);
                            }
                        }
                    };
                    this.session.on("packetReceived", onResponse);
                }
                else
                    reject("Not connected to the sharder.");
            });
        }
        else
            return new Promise((r) => this.__eval(code).then((result) => r([result])));
    }
    async __eval(code) {
        try {
            return await eval(code);
        }
        catch (err) {
            return err.stack;
        }
    }
}
export default Client;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL2NsaWVudC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEdBQUcsTUFBTSxLQUFLLENBQUM7QUFFdEIsT0FBTyxFQUNMLE1BQU0sSUFBSSxhQUFhLEdBR3hCLE1BQU0sWUFBWSxDQUFDO0FBRXBCLE9BQU8sZUFBZSxNQUFNLDZCQUE2QixDQUFDO0FBQzFELE9BQU8sTUFBTSxNQUFNLGdCQUFnQixDQUFDO0FBQ3BDLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUNoRCxPQUFPLFlBQVksTUFBTSxVQUFVLENBQUM7QUFDcEMsT0FBTyxnQkFBZ0IsTUFBTSw4QkFBOEIsQ0FBQztBQUM1RCxPQUFPLG1CQUFtQixNQUFNLGlDQUFpQyxDQUFDO0FBRWxFLE9BQU8seUJBQXlCLE1BQU0sdUNBQXVDLENBQUM7QUFDOUUsT0FBTyxlQUFlLE1BQU0sNkJBQTZCLENBQUM7QUFDMUQsT0FBTyxhQUFhLE1BQU0sMkJBQTJCLENBQUM7QUFrR3RELE1BQU0sT0FBTyxNQUFPLFNBQVEsYUFBYTtJQVl2QyxZQUFZLE9BQXNCO1FBQ2hDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztRQVZULGNBQVMsR0FBRyxLQUFLLENBQUM7UUFxRGxCLFlBQU8sR0FBRyxHQUFHLEVBQUU7WUFDckIsSUFBSSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1lBQzlCLE1BQU0sQ0FBQyxJQUFJLENBQUMsNkRBQTZELENBQUMsQ0FBQztZQUMzRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3ZDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDM0MsSUFBSSxDQUFDLE1BQU0sQ0FBQyxH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