"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerSession = exports.ClientSession = exports.Session = void 0;
const bytebuffer_1 = __importDefault(require("bytebuffer"));
const events_1 = require("events");
const PacketReceiver_1 = __importDefault(require("./PacketReceiver"));
const packets_1 = require("../packets");
class Session extends events_1.EventEmitter {
    constructor(socket, crypto, disableEncryption, packetReceiver = new PacketReceiver_1.default()) {
        super();
        this.socket = socket;
        this.crypto = crypto;
        this.disableEncryption = disableEncryption;
        this.packetReceiver = packetReceiver;
        this.maxShardCount = 0;
        this.ready = false;
        this.shardIds = [];
        this.totalEvals = 0;
        this.lastHeartbeat = Date.now() + 5000;
    }
    sendPacket(packet) {
        if (!packet.payload)
            packet.payload = new bytebuffer_1.default();
        packet.session = this;
        packet.encode();
        const payload = this.disableEncryption
            ? packet.payload.buffer
            : this.crypto.encrypt(packet.id, packet.payload.buffer.slice(0, packet.payload.offset));
        const header = Buffer.alloc(6);
        header.writeUInt16BE(packet.id);
        header.writeUInt32BE(payload.length, 2);
        this.socket.write(Buffer.concat([header, payload]));
        packet.processSend();
        this.emit("packetSent", packet);
    }
    async handlePacket(payload) {
        let fullPayload = await this.packetReceiver.receiveFullPacket(payload);
        if (fullPayload.length < 6)
            return;
        const header = fullPayload.slice(0, 6);
        const id = header.readUInt16BE();
        fullPayload = this.disableEncryption
            ? fullPayload.slice(6)
            : this.crypto.decrypt(id, fullPayload.slice(6));
        const PacketClass = packets_1.Factory.get(id);
        if (PacketClass) {
            const packet = new PacketClass();
            packet.payload = bytebuffer_1.default.allocate(fullPayload.length);
            packet.payload.append(fullPayload);
            packet.payload.offset = 0;
            packet.session = this;
            packet.decode();
            packet.processReceive();
            this.emit("packetReceived", packet);
        }
    }
}
exports.Session = Session;
class ClientSession extends Session {
    constructor(socket, crypto, disableEncryption) {
        super(socket, crypto, disableEncryption);
    }
}
exports.ClientSession = ClientSession;
class ServerSession extends Session {
    constructor(botToken, socket, crypto, disableEncryption) {
        super(socket, crypto, disableEncryption);
        this.botToken = botToken;
        this.loggedIn = false;
    }
}
exports.ServerSession = ServerSession;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2Vzc2lvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saWIvdXRpbC9TZXNzaW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLDREQUFvQztBQUNwQyxtQ0FBc0M7QUFHdEMsc0VBQThDO0FBSTlDLHdDQUFxQztBQTRCckMsTUFBYSxPQUFRLFNBQVEscUJBQVk7SUFRdkMsWUFDUyxNQUFrQixFQUNqQixNQUFjLEVBQ2YsaUJBQTBCLEVBQzFCLGlCQUFpQixJQUFJLHdCQUFjLEVBQUU7UUFFNUMsS0FBSyxFQUFFLENBQUM7UUFMRCxXQUFNLEdBQU4sTUFBTSxDQUFZO1FBQ2pCLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDZixzQkFBaUIsR0FBakIsaUJBQWlCLENBQVM7UUFDMUIsbUJBQWMsR0FBZCxjQUFjLENBQXVCO1FBWDlDLGtCQUFhLEdBQVcsQ0FBQyxDQUFDO1FBQzFCLFVBQUssR0FBRyxLQUFLLENBQUM7UUFFZCxhQUFRLEdBQWEsRUFBRSxDQUFDO1FBQ3hCLGVBQVUsR0FBRyxDQUFDLENBQUM7UUFDZixrQkFBYSxHQUFXLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUM7SUFTMUMsQ0FBQztJQUVELFVBQVUsQ0FBQyxNQUFjO1FBQ3ZCLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTztZQUFFLE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxvQkFBVSxFQUFFLENBQUM7UUFDdkQsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7UUFDdEIsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2hCLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxpQkFBaUI7WUFDcEMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTTtZQUN2QixDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQ2pCLE1BQU0sQ0FBQyxFQUFFLEVBQ1QsTUFBTSxDQUFDLE9BQU8sQ0FB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