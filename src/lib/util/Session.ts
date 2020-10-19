import ByteBuffer from "bytebuffer";
import { EventEmitter } from "events";
import net from "net";

import PacketReceiver from "./PacketReceiver";

import Client from "../client";
import Server from "../server";
import { Factory } from "../packets";
import Packet from "../packets/Packet";

export interface Crypto {
  encrypt(id: number, payload: Buffer): Buffer;
  decrypt(id: number, encryptedPayload: Buffer): Buffer;

  session: Session;
}

export declare interface Session {
  emit(event: "packetReceived", packet: Packet): boolean;
  emit(event: "packetSent", packet: Packet): boolean;
  emit(event: string | symbol, ...args: any[]): boolean;

  off(event: "packetReceived", listener: (packet: Packet) => void): this;
  off(event: "packetSent", listener: (packet: Packet) => void): this;
  off(event: string | symbol, listener: (...args: any[]) => void): this;

  on(event: "packetReceived", listener: (packet: Packet) => void): this;
  on(event: "packetSent", listener: (packet: Packet) => void): this;
  on(event: string | symbol, listener: (...args: any[]) => void): this;

  once(event: "packetReceived", listener: (packet: Packet) => void): this;
  once(event: "packetSent", listener: (packet: Packet) => void): this;
  once(event: string | symbol, listener: (...args: any[]) => void): this;
}

export class Session extends EventEmitter {
  maxShardCount: number = 0;
  ready = false;
  sessionKey?: Buffer;
  shardIds: number[] = [];
  totalEvals = 0;
  lastHeartbeat: number = Date.now() + 5000;

  constructor(
    public socket: net.Socket,
    private crypto: Crypto,
    public disableEncryption: boolean,
    public packetReceiver = new PacketReceiver()
  ) {
    super();
  }

  sendPacket(packet: Packet) {
    if (!packet.payload) packet.payload = new ByteBuffer();
    packet.session = this;
    packet.encode();
    const payload = this.disableEncryption
      ? packet.payload.buffer
      : this.crypto.encrypt(
          packet.id,
          packet.payload.buffer.slice(0, packet.payload.offset)
        );
    const header = Buffer.alloc(6);
    header.writeUInt16BE(packet.id);
    header.writeUInt32BE(payload.length, 2);
    this.socket.write(Buffer.concat([header, payload]));
    packet.processSend();
    this.emit("packetSent", packet);
  }

  async handlePacket(payload: Buffer) {
    let fullPayload = await this.packetReceiver.receiveFullPacket(payload);
    if (fullPayload.length < 6) return;
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
  client: Client;
  shardCount: number;

  constructor(socket: net.Socket, crypto: Crypto, disableEncryption: boolean) {
    super(socket, crypto, disableEncryption);
  }
}

export class ServerSession extends Session {
  loggedIn = false;

  server: Server;
  shardInfoSentAt: number;

  constructor(
    public botToken: string,
    socket: net.Socket,
    crypto: Crypto,
    disableEncryption: boolean
  ) {
    super(socket, crypto, disableEncryption);
  }
}
