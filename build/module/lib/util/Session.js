import ByteBuffer from "bytebuffer";
import { EventEmitter } from "events";
import PacketReceiver from "./PacketReceiver";
import { Factory } from "../packets";
export class Session extends EventEmitter {
    constructor(socket, crypto, disableEncryption, packetReceiver = new PacketReceiver()) {
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
            packet.payload = new ByteBuffer();
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
        const PacketClass = Factory.get(id);
        if (PacketClass) {
            const packet = new PacketClass();
            packet.payload = ByteBuffer.allocate(fullPayload.length);
            packet.payload.append(fullPayload);
            packet.payload.offset = 0;
            packet.session = this;
            packet.decode();
            packet.processReceive();
            this.emit("packetReceived", packet);
        }
    }
}
export class ClientSession extends Session {
    constructor(socket, crypto, disableEncryption) {
        super(socket, crypto, disableEncryption);
    }
}
export class ServerSession extends Session {
    constructor(botToken, socket, crypto, disableEncryption) {
        super(socket, crypto, disableEncryption);
        this.botToken = botToken;
        this.loggedIn = false;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2Vzc2lvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saWIvdXRpbC9TZXNzaW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sVUFBVSxNQUFNLFlBQVksQ0FBQztBQUNwQyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sUUFBUSxDQUFDO0FBR3RDLE9BQU8sY0FBYyxNQUFNLGtCQUFrQixDQUFDO0FBSTlDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxZQUFZLENBQUM7QUE0QnJDLE1BQU0sT0FBTyxPQUFRLFNBQVEsWUFBWTtJQVF2QyxZQUNTLE1BQWtCLEVBQ2pCLE1BQWMsRUFDZixpQkFBMEIsRUFDMUIsaUJBQWlCLElBQUksY0FBYyxFQUFFO1FBRTVDLEtBQUssRUFBRSxDQUFDO1FBTEQsV0FBTSxHQUFOLE1BQU0sQ0FBWTtRQUNqQixXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ2Ysc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFTO1FBQzFCLG1CQUFjLEdBQWQsY0FBYyxDQUF1QjtRQVg5QyxrQkFBYSxHQUFXLENBQUMsQ0FBQztRQUMxQixVQUFLLEdBQUcsS0FBSyxDQUFDO1FBRWQsYUFBUSxHQUFhLEVBQUUsQ0FBQztRQUN4QixlQUFVLEdBQUcsQ0FBQyxDQUFDO1FBQ2Ysa0JBQWEsR0FBVyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDO0lBUzFDLENBQUM7SUFFRCxVQUFVLENBQUMsTUFBYztRQUN2QixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU87WUFBRSxNQUFNLENBQUMsT0FBTyxHQUFHLElBQUksVUFBVSxFQUFFLENBQUM7UUFDdkQsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7UUFDdEIsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2hCLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxpQkFBaUI7WUFDcEMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMs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