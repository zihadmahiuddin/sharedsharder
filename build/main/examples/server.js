"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const __1 = require("..");
const server = new __1.Server({
    // encryption is bugged rn
    disableEncryption: false,
    shardCount: 2,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2V4YW1wbGVzL3NlcnZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLG9EQUE0QjtBQUU1QixnQkFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBRWhCLDBCQUE0QjtBQUU1QixNQUFNLE1BQU0sR0FBRyxJQUFJLFVBQU0sQ0FBQztJQUN4QiwwQkFBMEI7SUFDMUIsaUJBQWlCLEVBQUUsS0FBSztJQUN4QixVQUFVLEVBQUUsQ0FBQztJQUNiLFNBQVMsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQjtJQUN4QyxLQUFLLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhO0NBQ2pDLENBQUMsQ0FBQztBQUVILE1BQU0sQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRTtJQUN0QixPQUFPLENBQUMsSUFBSSxDQUFDLDRCQUE0QixDQUFDLENBQUM7QUFDN0MsQ0FBQyxDQUFDLENBQUM7QUFFSCxNQUFNLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQ2xDLE9BQU8sQ0FBQyxHQUFHLENBQ1QseUJBQXlCLE9BQU8sQ0FBQyxNQUFNLENBQUMsYUFBYSxJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLENBQ3JGLENBQ0YsQ0FBQztBQUVGLE1BQU0sQ0FBQyxFQUFFLENBQUMsV0FBVyxFQUFFLEdBQUcsRUFBRTtJQUMxQixPQUFPLENBQUMsR0FBRyxDQUNULGlDQUFpQyxNQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksR0FBRyxDQUNuRixDQUFDO0FBQ0osQ0FBQyxDQUFDLENBQUM7QUFFSCxNQUFNLENBQUMsRUFBRSxDQUFDLGVBQWUsRUFBRSxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsRUFBRTtJQUMvQyxPQUFPLENBQUMsR0FBRyxDQUNULFVBQVUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxhQUFhLElBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFVLGlCQUFpQixRQUFRLEdBQUcsQ0FDaEcsQ0FBQztJQUVGLE9BQU8sQ0FBQyxHQUFHLENBQ1QseUJBQXlCLE1BQU0sQ0FBQyxvQkFBb0IseUJBQXlCLE1BQU0sQ0FBQyxpQkFBaUIsR0FBRyxDQUN6RyxDQUFDO0FBQ0osQ0FBQyxDQUFDLENBQUM7QUFFSCxNQUFNLENBQUMsRUFBRSxDQUFDLG9CQUFvQixFQUFFLENBQUMsT0FBTyxFQUFFLEVBQUU7SUFDMUMsT0FBTyxDQUFDLEdBQUcsQ0FDVCxVQUFVLE9BQU8sQ0FBQyxNQUFNLENBQUMsYUFBYSxJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsVUFBVSwrQkFBK0IsT0FBTyxDQUFDLFFBQVEsR0FBRyxDQUN0SCxDQUFDO0lBQ0YsT0FBTyxDQUFDLEdBQUcsQ0FDVCx5QkFBeUIsTUFBTSxDQUFDLG9CQUFvQix5QkFBeUIsTUFBTSxDQUFDLGlCQUFpQixHQUFHLENBQ3pHLENBQUM7QUFDSixDQUFDLENBQUMsQ0FBQztBQUVILE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyJ9