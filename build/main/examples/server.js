"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const __1 = require("..");
const server = new __1.Server({
    disableEncryption: false,
    shardCount: 5,
    secretKey: process.env.SERVER_SECRET_KEY,
    token: process.env.DISCORD_TOKEN,
});
server.on("close", () => {
    console.warn("SocketShard Server closed.");
});
server.on("connection", (session) => console.log(`Client connected from ${session.socket.remoteAddress}:${session.socket.remotePort}`));
server.on("listening", () => {
    console.log(`SocketShard Server started on ${server.options.hostname}:${server.options.port}!`);
});
server.on("shardInfoSent", (session, shardIds) => {
    console.log(`Client ${session.socket.remoteAddress}:${session.socket.remotePort} got shards: [${shardIds}]`);
    console.log(`Disconnected shards: [${server.disconnectedShardIds}], connected shards: [${server.connectedShardIds}]`);
});
server.on("clientDisconnected", (session) => {
    console.log(`Client ${session.socket.remoteAddress}:${session.socket.remotePort} disconnected with shards: [${session.shardIds}]`);
    console.log(`Disconnected shards: [${server.disconnectedShardIds}], connected shards: [${server.connectedShardIds}]`);
});
server.start();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2V4YW1wbGVzL3NlcnZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLG9EQUE0QjtBQUU1QixnQkFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBRWhCLDBCQUE0QjtBQUU1QixNQUFNLE1BQU0sR0FBRyxJQUFJLFVBQU0sQ0FBQztJQUN4QixpQkFBaUIsRUFBRSxLQUFLO0lBQ3hCLFVBQVUsRUFBRSxDQUFDO0lBQ2IsU0FBUyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCO0lBQ3hDLEtBQUssRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWE7Q0FDakMsQ0FBQyxDQUFDO0FBRUgsTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFO0lBQ3RCLE9BQU8sQ0FBQyxJQUFJLENBQUMsNEJBQTRCLENBQUMsQ0FBQztBQUM3QyxDQUFDLENBQUMsQ0FBQztBQUVILE1BQU0sQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FDbEMsT0FBTyxDQUFDLEdBQUcsQ0FDVCx5QkFBeUIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxhQUFhLElBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsQ0FDckYsQ0FDRixDQUFDO0FBRUYsTUFBTSxDQUFDLEVBQUUsQ0FBQyxXQUFXLEVBQUUsR0FBRyxFQUFFO0lBQzFCLE9BQU8sQ0FBQyxHQUFHLENBQ1QsaUNBQWlDLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLENBQ25GLENBQUM7QUFDSixDQUFDLENBQUMsQ0FBQztBQUVILE1BQU0sQ0FBQyxFQUFFLENBQUMsZUFBZSxFQUFFLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxFQUFFO0lBQy9DLE9BQU8sQ0FBQyxHQUFHLENBQ1QsVUFBVSxPQUFPLENBQUMsTUFBTSxDQUFDLGFBQWEsSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQVUsaUJBQWlCLFFBQVEsR0FBRyxDQUNoRyxDQUFDO0lBRUYsT0FBTyxDQUFDLEdBQUcsQ0FDVCx5QkFBeUIsTUFBTSxDQUFDLG9CQUFvQix5QkFBeUIsTUFBTSxDQUFDLGlCQUFpQixHQUFHLENBQ3pHLENBQUM7QUFDSixDQUFDLENBQUMsQ0FBQztBQUVILE1BQU0sQ0FBQyxFQUFFLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxPQUFPLEVBQUUsRUFBRTtJQUMxQyxPQUFPLENBQUMsR0FBRyxDQUNULFVBQVUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxhQUFhLElBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFVLCtCQUErQixPQUFPLENBQUMsUUFBUSxHQUFHLENBQ3RILENBQUM7SUFDRixPQUFPLENBQUMsR0FBRyxDQUNULHlCQUF5QixNQUFNLENBQUMsb0JBQW9CLHlCQUF5QixNQUFNLENBQUMsaUJBQWlCLEdBQUcsQ0FDekcsQ0FBQztBQUNKLENBQUMsQ0FBQyxDQUFDO0FBRUgsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDIn0=