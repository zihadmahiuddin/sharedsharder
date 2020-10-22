import { Client } from "..";

const client = new Client({
  disableEncryption: false,
  maxShardCount: 1,
  serverKey: process.env.SERVER_PUBLIC_KEY,
  // sharedShardingEnabled: false,
});

client.on("ready", () => {
  console.log("ready!");
});

client.on("message", async (message) => {
  if (message.content.startsWith("!eval"))
    console.log(await client.broadcastEval(message.content.slice(5).trim()));
});

client.on("shardInfo", ([shardCount, shardIds]) => {
  console.log(`Shard Info Received: ${shardCount} - [${shardIds.join(", ")}]`);
});

client.login();
