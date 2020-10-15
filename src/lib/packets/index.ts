import fs from "fs";
import path from "path";
import Logger from "../util/Logger";

export const Factory = new Map();

const loadPackets = () => {
  const packetsPath = __dirname;
  if (!fs.existsSync(packetsPath)) return;

  fs.readdir(packetsPath, (err, files) => {
    if (err) Logger.error(err);
    else {
      for (const file of files) {
        const filePath = path.join(packetsPath, file);
        const stats = fs.statSync(filePath);
        if (!stats.isDirectory()) continue;

        fs.readdir(filePath, (err, packetFolder) => {
          if (err) Logger.error(err);
          else {
            for (const packetFile of packetFolder) {
              if (!packetFile.endsWith(".js")) continue;
              try {
                const packetFilePath = path.join(filePath, packetFile);
                const packetModule = require(packetFilePath);
                const PacketClass = packetModule.default || packetModule;
                const packetId = new PacketClass().id;
                if (Factory.has(packetId)) {
                  throw new Error(
                    `Same ID ${packetId} found for both ${
                      Factory.get(packetId).name
                    } and ${PacketClass.name}`
                  );
                }
                Factory.set(packetId, PacketClass);
              } catch (err) {
                Logger.error(err);
              }
            }
          }
        });
      }
    }
  });
};

loadPackets();
