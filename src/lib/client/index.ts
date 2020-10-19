import net from "net";

import {
  Client as DiscordClient,
  ClientEvents as DiscordClientEvents,
  ClientOptions as DiscordClientOptions,
} from "discord.js";

import HandshakePacket from "../packets/client/Handshake";
import Logger from "../util/Logger";
import { ClientSession } from "../util/Session";
import ClientCrypto from "./Crypto";
import ShardReadyPacket from "../packets/client/ShardReady";
import BroadcastEvalPacket from "../packets/client/BroadcastEval";
import Packet from "../packets/Packet";
import BroadcastEvalResultPacket from "../packets/server/BroadcastEvalResult";
import HeartbeatPacket from "../packets/client/Heartbeat";
import LoginOkPacket from "../packets/server/LoginOk";

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
  // #region Events Handlers
  on<K extends keyof ClientEvents>(
    event: K,
    listener: (...args: ClientEvents[K]) => void
  ): this;
  on<S extends string | symbol>(
    event: Exclude<S, keyof ClientEvents>,
    listener: (...args: any[]) => void
  ): this;

  once<K extends keyof ClientEvents>(
    event: K,
    listener: (...args: ClientEvents[K]) => void
  ): this;
  once<S extends string | symbol>(
    event: Exclude<S, keyof ClientEvents>,
    listener: (...args: any[]) => void
  ): this;

  emit<K extends keyof ClientEvents>(
    event: K,
    ...args: ClientEvents[K]
  ): boolean;
  emit<S extends string | symbol>(
    event: Exclude<S, keyof ClientEvents>,
    ...args: any[]
  ): boolean;

  off<K extends keyof ClientEvents>(
    event: K,
    listener: (...args: ClientEvents[K]) => void
  ): this;
  off<S extends string | symbol>(
    event: Exclude<S, keyof ClientEvents>,
    listener: (...args: any[]) => void
  ): this;

  removeAllListeners<K extends keyof ClientEvents>(event?: K): this;
  removeAllListeners<S extends string | symbol>(
    event?: Exclude<S, keyof ClientEvents>
  ): this;
  // #endregion
}

export class Client extends DiscordClient {
  private socket: net.Socket;
  private crypto: ClientCrypto;
  private wasClosed = false;
  private heartbeatInterval: NodeJS.Timeout;

  private session?: ClientSession;

  options: ClientOptions;
  shardCount: number;
  shardIds: number[];

  constructor(options: ClientOptions) {
    super(options);
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
    } else {
      this.options.shardCount = this.options.shardCount || 1;
      this.options.shardIds = this.options.shardIds || [0];
    }
  }

  connect() {
    this.socket.connect(this.options.port, this.options.hostname);
    return new Promise<void>((r) => {
      this.once("connected", () => {
        r();
      });
    });
  }

  private initialize() {
    this.socket = new net.Socket();
    this.socket.on("close", this.onClose);
    this.socket.on("connect", this.onConnect);
    this.socket.on("data", this.onData);
    this.socket.on("error", this.onError);
  }

  private onClose = () => {
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

  private onConnect = () => {
    this.emit("connected");
    Logger.info(
      `Connected to ${this.socket.remoteAddress}:${this.socket.remotePort}!`
    );
    this.crypto = new ClientCrypto(Buffer.from(this.options.serverKey, "hex"));
    this.session = new ClientSession(
      this.socket,
      this.crypto,
      this.options.disableEncryption
    );
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

  private onLoginOk = (packet: Packet) => {
    if (packet instanceof LoginOkPacket) {
      this.session.off("packetReceived", this.onLoginOk);
      setInterval(this.heartbeat, 5000);
    }
  };

  private onData = async (data: Buffer) => {
    await this.session.handlePacket(data);
  };

  private onError = (err: Error) => {
    Logger.error("SocketShard Client error", err);
  };

  private onShardInfo = (shardInfo: [number, number[]]) => {
    this.shardCount = shardInfo[0];
    this.shardIds = shardInfo[1];
    this.session.shardCount = shardInfo[0];
    this.session.shardIds = shardInfo[1];
  };

  private heartbeat = () => {
    const secondsSinceLastHeartbeat =
      (Date.now() - this.session?.lastHeartbeat) / 1000;
    if (secondsSinceLastHeartbeat >= 30) {
      Logger.error(
        `Last heartbeat ack was received more than ${secondsSinceLastHeartbeat} seconds ago. Exiting`
      );
      process.exit(1);
    } else if (secondsSinceLastHeartbeat >= 10) {
      Logger.warn(
        `Last heartbeat ack was received more than ${secondsSinceLastHeartbeat} seconds ago`
      );
    }
    this.session?.sendPacket(new HeartbeatPacket());
  };

  async login(token?: string): Promise<string> {
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
            } else resolve(token);
            if (this.readyTimestamp) {
              this.session.ready = true;
              const shardReadyPacket = new ShardReadyPacket();
              shardReadyPacket.shardIds = this.session.shardIds;
              this.session.sendPacket(shardReadyPacket);
            } else {
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

  broadcastEval<T = any>(code: string, timeout?: number) {
    if (this.options.sharedShardingEnabled) {
      return new Promise<T[]>((resolve, reject) => {
        if (this.session) {
          const broadcastEvalPacket = new BroadcastEvalPacket();
          broadcastEvalPacket.code = code;
          broadcastEvalPacket.evalId = this.session.totalEvals++;
          if (timeout) broadcastEvalPacket.timeout = timeout;
          this.session.sendPacket(broadcastEvalPacket);
          const onResponse = (packet: Packet) => {
            if (packet instanceof BroadcastEvalResultPacket) {
              if (packet.evalId === broadcastEvalPacket.evalId) {
                resolve(packet.responses);
                this.session.off("packetReceived", onResponse);
              }
            }
          };
          this.session.on("packetReceived", onResponse);
        } else reject("Not connected to the sharder.");
      });
    } else
      return new Promise<T[]>((r) =>
        this.__eval(code).then((result) => r([result]))
      );
  }

  async __eval(code: string) {
    try {
      return await eval(code);
    } catch (err) {
      return err.stack;
    }
  }
}

export default Client;
