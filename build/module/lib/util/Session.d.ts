/// <reference types="node" />
import { EventEmitter } from "events";
import net from "net";
import PacketReceiver from "./PacketReceiver";
import Client from "../client";
import Server from "../server";
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
export declare class Session extends EventEmitter {
    socket: net.Socket;
    private crypto;
    disableEncryption: boolean;
    packetReceiver: PacketReceiver;
    maxShardCount: number;
    ready: boolean;
    sessionKey?: Buffer;
    shardIds: number[];
    totalEvals: number;
    lastHeartbeat: number;
    constructor(socket: net.Socket, crypto: Crypto, disableEncryption: boolean, packetReceiver?: PacketReceiver);
    sendPacket(packet: Packet): void;
    handlePacket(payload: Buffer): Promise<void>;
}
export declare class ClientSession extends Session {
    client: Client;
    shardCount: number;
    constructor(socket: net.Socket, crypto: Crypto, disableEncryption: boolean);
}
export declare class ServerSession extends Session {
    botToken: string;
    loggedIn: boolean;
    server: Server;
    shardInfoSentAt: number;
    constructor(botToken: string, socket: net.Socket, crypto: Crypto, disableEncryption: boolean);
}
