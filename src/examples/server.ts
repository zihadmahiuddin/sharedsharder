import dotenv from "dotenv";

dotenv.config();

import { Server } from "..";

const server = new Server({
  shardCount: 2,
  secretKey: process.env.SERVER_SECRET_KEY,
  token: process.env.DISCORD_TOKEN,
});

server.on("clientDisconnected", (session) => {
  console.log(
    `Client ${session.socket.remoteAddress}:${session.socket.remotePort} disconnected`
  );
});

server.on("close", () => {
  console.warn("SocketShard Server closed.");
});

server.on("connection", (session) =>
  console.log(
    `Client connected from ${session.socket.remoteAddress}:${session.socket.remotePort}`
  )
);

server.on("listening", () => {
  console.log(
    `SocketShard Server started on ${server.options.hostname}:${server.options.port}!`
  );
});

server.start();
