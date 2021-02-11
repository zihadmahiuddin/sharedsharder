"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const net_1 = __importDefault(require("net"));
const discord_js_1 = require("discord.js");
const Handshake_1 = __importDefault(require("../packets/client/Handshake"));
const Logger_1 = __importDefault(require("../util/Logger"));
const Session_1 = require("../util/Session");
const Crypto_1 = __importDefault(require("./Crypto"));
const ShardReady_1 = __importDefault(require("../packets/client/ShardReady"));
const BroadcastEval_1 = __importDefault(require("../packets/client/BroadcastEval"));
const BroadcastEvalResult_1 = __importDefault(require("../packets/server/BroadcastEvalResult"));
const Heartbeat_1 = __importDefault(require("../packets/client/Heartbeat"));
const LoginOk_1 = __importDefault(require("../packets/server/LoginOk"));
class Client extends discord_js_1.Client {
    constructor(options) {
        super(options);
        this.wasClosed = false;
        this.onClose = () => {
            this.emit("connectionClosed");
            Logger_1.default.warn("SocketShard Client disconnected. Attempting to reconnect...");
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
            Logger_1.default.info(`Connected to ${this.socket.remoteAddress}:${this.socket.remotePort}!`);
            this.crypto = new Crypto_1.default(Buffer.from(this.options.serverKey, "hex"));
            this.session = new Session_1.ClientSession(this.socket, this.crypto, this.options.disableEncryption);
            this.session.client = this;
            this.crypto.session = this.session;
            const handshakePacket = new Handshake_1.default();
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
            if (packet instanceof LoginOk_1.default) {
                this.session.off("packetReceived", this.onLoginOk);
                setInterval(this.heartbeat, 5000);
            }
        };
        this.onData = async (data) => {
            await this.session.handlePacket(data);
        };
        this.onError = (err) => {
            Logger_1.default.error("SocketShard Client error", err);
        };
        this.onShardInfo = (shardInfo) => {
            this.shardCount = shardInfo[0];
            this.shardIds = shardInfo[1];
            this.session.shardCount = shardInfo[0];
            this.session.shardIds = shardInfo[1];
        };
        this.heartbeat = () => {
            var _a, _b;
            const secondsSinceLastHeartbeat = (Date.now() - ((_a = this.session) === null || _a === void 0 ? void 0 : _a.lastHeartbeat)) / 1000;
            if (secondsSinceLastHeartbeat >= 30) {
                Logger_1.default.error(`Last heartbeat ack was received more than ${secondsSinceLastHeartbeat} seconds ago. Exiting`);
                process.exit(1);
            }
            else if (secondsSinceLastHeartbeat >= 10) {
                Logger_1.default.warn(`Last heartbeat ack was received more than ${secondsSinceLastHeartbeat} seconds ago`);
            }
            (_b = this.session) === null || _b === void 0 ? void 0 : _b.sendPacket(new Heartbeat_1.default());
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
        this.socket = new net_1.default.Socket();
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
                    var _a, _b;
                    if (((_a = this.session) === null || _a === void 0 ? void 0 : _a.shardCount) && ((_b = this.session) === null || _b === void 0 ? void 0 : _b.shardIds.length)) {
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
                            const shardReadyPacket = new ShardReady_1.default();
                            shardReadyPacket.shardIds = this.session.shardIds;
                            this.session.sendPacket(shardReadyPacket);
                        }
                        else {
                            this.once("ready", () => {
                                this.session.ready = true;
                                const shardReadyPacket = new ShardReady_1.default();
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
                    const broadcastEvalPacket = new BroadcastEval_1.default();
                    broadcastEvalPacket.code = code;
                    broadcastEvalPacket.evalId = this.session.totalEvals++;
                    if (timeout)
                        broadcastEvalPacket.timeout = timeout;
                    this.session.sendPacket(broadcastEvalPacket);
                    const onResponse = (packet) => {
                        if (packet instanceof BroadcastEvalResult_1.default) {
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
exports.Client = Client;
exports.default = Client;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL2NsaWVudC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSw4Q0FBc0I7QUFFdEIsMkNBSW9CO0FBRXBCLDRFQUEwRDtBQUMxRCw0REFBb0M7QUFDcEMsNkNBQWdEO0FBQ2hELHNEQUFvQztBQUNwQyw4RUFBNEQ7QUFDNUQsb0ZBQWtFO0FBRWxFLGdHQUE4RTtBQUM5RSw0RUFBMEQ7QUFDMUQsd0VBQXNEO0FBa0d0RCxNQUFhLE1BQU8sU0FBUSxtQkFBYTtJQVl2QyxZQUFZLE9BQXNCO1FBQ2hDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztRQVZULGNBQVMsR0FBRyxLQUFLLENBQUM7UUFxRGxCLFlBQU8sR0FBRyxHQUFHLEVBQUU7WUFDckIsSUFBSSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1lBQzlCLGdCQUFNLENBQUMsSUFBSSxDQUFDLDZEQUE2RCxDQUFDLENBQUM7WUFDM0UsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN2QyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzNDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDckMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN2QyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDeEMsYUFBYSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1lBQ3RDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FB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