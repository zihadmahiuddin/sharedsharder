import { EventEmitter } from "events";
import net from "net";
import DisconnectPacket from "../packets/server/Disconnect";
import HeartbeatAckPacket from "../packets/server/HeartbeatAck";
import ShardInfoPacket from "../packets/server/ShardInfo";
import Logger from "../util/Logger";
import { ServerSession } from "../util/Session";
import ServerCrypto from "./Crypto";

export interface ServerOptions {
  /**
   * Hex encoded secret key to generate the server keypair for encryption
   */
  secretKey: string;
  /**
   * The number of shards to use
   */
  shardCount: number;
  /**
   * The token to use for logging in to discord
   */
  token: string;
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
  // #region Events Handlers
  on<K extends keyof ServerEvents>(
    event: K,
    listener: (...args: ServerEvents[K]) => void
  ): this;
  on<S extends string | symbol>(
    event: Exclude<S, keyof ServerEvents>,
    listener: (...args: any[]) => void
  ): this;

  once<K extends keyof ServerEvents>(
    event: K,
    listener: (...args: ServerEvents[K]) => void
  ): this;
  once<S extends string | symbol>(
    event: Exclude<S, keyof ServerEvents>,
    listener: (...args: any[]) => void
  ): this;

  emit<K extends keyof ServerEvents>(
    event: K,
    ...args: ServerEvents[K]
  ): boolean;
  emit<S extends string | symbol>(
    event: Exclude<S, keyof ServerEvents>,
    ...args: any[]
  ): boolean;

  off<K extends keyof ServerEvents>(
    event: K,
    listener: (...args: ServerEvents[K]) => void
  ): this;
  off<S extends string | symbol>(
    event: Exclude<S, keyof ServerEvents>,
    listener: (...args: any[]) => void
  ): this;

  removeAllListeners<K extends keyof ServerEvents>(event?: K): this;
  removeAllListeners<S extends string | symbol>(
    event?: Exclude<S, keyof ServerEvents>
  ): this;
  // #endregion
}

export class Server extends EventEmitter {
  sessions: ServerSession[];

  private server: net.Server;
  private heartbeatCheckInterval: NodeJS.Timeout;
  private shardDistributionInterval: NodeJS.Timeout;

  constructor(public options: ServerOptions) {
    super();
    if (!options.secretKey) {
      throw new Error("Secret Key is required for encryption.");
    }

    options.port = options.port || 5252;
    options.hostname = options.hostname || "0.0.0.0";
    this.initialize();
  }

  start() {
    this.server.listen(this.options.port, this.options.hostname);
  }

  private initialize() {
    this.sessions = [];
    this.server = new net.Server();
    this.server.on("close", this.onClose);
    this.server.on("connection", this.onConnection);
    this.server.on("error", this.onError);
    this.server.on("listening", this.onListening);
  }

  private onClose = () => {
    this.emit("close");
    this.server.off("close", this.onClose);
    this.server.off("connection", this.onConnection);
    this.server.off("error", this.onError);
    this.server.off("listening", this.onListening);
    clearInterval(this.heartbeatCheckInterval);
    clearInterval(this.shardDistributionInterval);
    for (const session of this.sessions) {
      if (!session.socket.destroyed) session.socket.destroy();
    }
    this.initialize();
    this.start();
  };

  private onConnection = (socket: net.Socket) => {
    const crypto = new ServerCrypto(this.options.secretKey);
    const session = new ServerSession(this.options.token, socket, crypto);
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
      this.emit(
        "clientDisconnected",
        this.sessions.splice(this.sessions.indexOf(session), 1)[0]
      );
    });
    this.emit("connection", session);
  };

  private onError = (err: Error) => {
    Logger.error("SocketShard Server error", err);
  };

  private getNextShardIds(maxCount: number) {
    const shardIds = [];
    for (let i = 0; i < this.options.shardCount; i++) {
      if (shardIds.length >= maxCount) break;
      if (!this.sessions.some((x) => x.shardIds.includes(i))) {
        shardIds.push(i);
      }
    }
    return shardIds;
  }

  private get latestShardInfoSendTime() {
    return this.sessions.sort(
      (x, y) => y.shardInfoSentAt - x.shardInfoSentAt
    )[0]?.shardInfoSentAt;
  }

  private heartbeatCheck = () => {
    for (const session of this.sessions) {
      const secondsSinceLastHeartbeat =
        (Date.now() - session?.lastHeartbeat) / 1000;
      if (secondsSinceLastHeartbeat >= 30) {
        Logger.error(
          `Disconnecting ${session.socket.remoteAddress}:${session.socket.remotePort} as the last heartbeat was received more than ${secondsSinceLastHeartbeat} seconds ago.`
        );
        session.socket.destroy();
        this.emit(
          "clientDisconnected",
          this.sessions.splice(this.sessions.indexOf(session), 1)[0]
        );
      } else if (secondsSinceLastHeartbeat >= 10) {
        Logger.warn(
          `The last heartbeat from ${session.socket.remoteAddress}:${session.socket.remotePort} was received more than ${secondsSinceLastHeartbeat} seconds ago.`
        );
      }
      session.sendPacket(new HeartbeatAckPacket());
    }
  };

  private shardDistribution = () => {
    if (this.latestShardInfoSendTime + 5000 > Date.now()) return;
    const sessionArray = Array.from(this.sessions.values());
    for (const session of sessionArray) {
      if (sessionArray.filter((x) => x.shardIds.length).every((x) => x.ready)) {
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
            shardInfoPacket.shardIds = this.getNextShardIds(
              session.maxShardCount
            );
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

  private onListening = () => {
    this.emit("listening");
    this.heartbeatCheckInterval = setInterval(this.heartbeatCheck, 5000);
    this.shardDistributionInterval = setInterval(this.shardDistribution, 100);
  };

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
