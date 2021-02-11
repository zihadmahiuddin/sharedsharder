/// <reference types="node" />
import { EventEmitter } from "events";
import { ServerSession } from "../util/Session";
export interface ServerOptions {
    /**
     * The number of shards to use
     */
    shardCount: number;
    /**
     * The token to use for logging in to discord
     */
    token: string;
    /**
     * Hex encoded secret key to generate the server keypair for encryption
     */
    secretKey?: string;
    /**
     * Disables encryption. Not recommended if the server is open to public.
     * @default false
     */
    disableEncryption?: boolean;
    /**
     * The port to listen on.
     * @default 5252
     */
    port?: number;
    /**
     * The hostname to listen on.
     * @default "0.0.0.0"
     */
    hostname?: string;
}
export interface ServerEvents {
    clientDisconnected: [session: ServerSession];
    close: [];
    connection: [session: ServerSession];
    listening: [];
    shardInfoSent: [session: ServerSession, shardIds: number[]];
}
export declare interface Server {
    on<K extends keyof ServerEvents>(event: K, listener: (...args: ServerEvents[K]) => void): this;
    on<S extends string | symbol>(event: Exclude<S, keyof ServerEvents>, listener: (...args: any[]) => void): this;
    once<K extends keyof ServerEvents>(event: K, listener: (...args: ServerEvents[K]) => void): this;
    once<S extends string | symbol>(event: Exclude<S, keyof ServerEvents>, listener: (...args: any[]) => void): this;
    emit<K extends keyof ServerEvents>(event: K, ...args: ServerEvents[K]): boolean;
    emit<S extends string | symbol>(event: Exclude<S, keyof ServerEvents>, ...args: any[]): boolean;
    off<K extends keyof ServerEvents>(event: K, listener: (...args: ServerEvents[K]) => void): this;
    off<S extends string | symbol>(event: Exclude<S, keyof ServerEvents>, listener: (...args: any[]) => void): this;
    removeAllListeners<K extends keyof ServerEvents>(event?: K): this;
    removeAllListeners<S extends string | symbol>(event?: Exclude<S, keyof ServerEvents>): this;
}
export declare class Server extends EventEmitter {
    options: ServerOptions;
    sessions: ServerSession[];
    private server;
    private heartbeatCheckInterval;
    private shardDistributionInterval;
    constructor(options: ServerOptions);
    start(): void;
    private initialize;
    private onClose;
    private onConnection;
    private onError;
    private getNextShardIds;
    private get latestShardInfoSendTime();
    private heartbeatCheck;
    private shardDistribution;
    private onListening;
    get connectedShardIds(): number[];
    get disconnectedShardIds(): number[];
}
export default Server;
