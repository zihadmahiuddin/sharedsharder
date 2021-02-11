import { Client as DiscordClient, ClientEvents as DiscordClientEvents, ClientOptions as DiscordClientOptions } from "discord.js";
export interface ClientOptions extends DiscordClientOptions {
    /**
     * Hex encoded public key of the server to use for encryption
     */
    serverKey?: string;
    /**
     * Disables encryption. Not recommended if the server is open to public.
     * @default false
     */
    disableEncryption?: boolean;
    /**
     * Shard count to send to the discord API, only used if shared sharding is disabled
     * @default 1
     */
    shardCount?: number;
    /**
     * Array of shard ids to use for this client, only used if shared sharding is disabled
     * @default [0]
     */
    shardIds?: number[];
    /**
     * Whether shared sharding should be enabled or not
     * @default true
     */
    sharedShardingEnabled?: boolean;
    /**
     * The max number of shards this client can handle
     * @default 1
     */
    maxShardCount?: number;
    /**
     * The token to use for logging in to discord
     */
    token?: string;
    /**
     * The port to connect to on.
     * @default 5252
     */
    port?: number;
    /**
     * The hostname to connect to.
     * @default "0.0.0.0"
     */
    hostname?: string;
}
export interface ClientEvents extends DiscordClientEvents {
    connectionClosed: [];
    connected: [];
}
export declare interface Client {
    on<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => void): this;
    on<S extends string | symbol>(event: Exclude<S, keyof ClientEvents>, listener: (...args: any[]) => void): this;
    once<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => void): this;
    once<S extends string | symbol>(event: Exclude<S, keyof ClientEvents>, listener: (...args: any[]) => void): this;
    emit<K extends keyof ClientEvents>(event: K, ...args: ClientEvents[K]): boolean;
    emit<S extends string | symbol>(event: Exclude<S, keyof ClientEvents>, ...args: any[]): boolean;
    off<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => void): this;
    off<S extends string | symbol>(event: Exclude<S, keyof ClientEvents>, listener: (...args: any[]) => void): this;
    removeAllListeners<K extends keyof ClientEvents>(event?: K): this;
    removeAllListeners<S extends string | symbol>(event?: Exclude<S, keyof ClientEvents>): this;
}
export declare class Client extends DiscordClient {
    private socket;
    private crypto;
    private wasClosed;
    private heartbeatInterval;
    private session?;
    options: ClientOptions;
    shardCount: number;
    shardIds: number[];
    constructor(options: ClientOptions);
    connect(): Promise<void>;
    private initialize;
    private onClose;
    private onConnect;
    private onLoginOk;
    private onData;
    private onError;
    private onShardInfo;
    private heartbeat;
    login(token?: string): Promise<string>;
    broadcastEval<T = any>(code: string, timeout?: number): Promise<T[]>;
    __eval(code: string): Promise<any>;
}
export default Client;
