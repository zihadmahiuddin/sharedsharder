import { Client } from "..";

const client = new Client({
  serverKey: process.env.SERVER_PUBLIC_KEY,
  maxShardCount: 1,
  // sharedShardingEnabled: false,
});

client.on("ready", () => {
  console.log("ready!");
});

client.on("message", async (message) => {
  if (message.content.startsWith("!eval"))
    console.log(await client.broadcastEval(message.content.slice(5).trim()));
});

client.login();
