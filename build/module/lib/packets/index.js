import fs from "fs";
import path from "path";
import Logger from "../util/Logger";
export const Factory = new Map();
const loadPackets = () => {
    const packetsPath = __dirname;
    if (!fs.existsSync(packetsPath))
        return;
    fs.readdir(packetsPath, (err, files) => {
        if (err)
            Logger.error(err);
        else {
            for (const file of files) {
                const filePath = path.join(packetsPath, file);
                const stats = fs.statSync(filePath);
                if (!stats.isDirectory())
                    continue;
                fs.readdir(filePath, (err, packetFolder) => {
                    if (err)
                        Logger.error(err);
                    else {
                        for (const packetFile of packetFolder) {
                            if (!packetFile.endsWith(".js"))
                                continue;
                            try {
                                const packetFilePath = path.join(filePath, packetFile);
                                const packetModule = require(packetFilePath);
                                const PacketClass = packetModule.default || packetModule;
                                const packetId = new PacketClass().id;
                                if (Factory.has(packetId)) {
                                    throw new Error(`Same ID ${packetId} found for both ${Factory.get(packetId).name} and ${PacketClass.name}`);
                                }
                                Factory.set(packetId, PacketClass);
                            }
                            catch (err) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL3BhY2tldHMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE1BQU0sSUFBSSxDQUFDO0FBQ3BCLE9BQU8sSUFBSSxNQUFNLE1BQU0sQ0FBQztBQUN4QixPQUFPLE1BQU0sTUFBTSxnQkFBZ0IsQ0FBQztBQUVwQyxNQUFNLENBQUMsTUFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUVqQyxNQUFNLFdBQVcsR0FBRyxHQUFHLEVBQUU7SUFDdkIsTUFBTSxXQUFXLEdBQUcsU0FBUyxDQUFDO0lBQzlCLElBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQztRQUFFLE9BQU87SUFFeEMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLEVBQUU7UUFDckMsSUFBSSxHQUFHO1lBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUN0QjtZQUNILEtBQUssTUFBTSxJQUFJLElBQUksS0FBSyxFQUFFO2dCQUN4QixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDOUMsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDcEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUU7b0JBQUUsU0FBUztnQkFFbkMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxHQUFHLEVBQUUsWUFBWSxFQUFFLEVBQUU7b0JBQ3pDLElBQUksR0FBRzt3QkFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO3lCQUN0Qjt3QkFDSCxLQUFLLE1BQU0sVUFBVSxJQUFJLFlBQVksRUFBRTs0QkFDckMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDO2dDQUFFLFNBQVM7NEJBQzFDLElBQUk7Z0NBQ0YsTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsVUFBVSxDQUFDLENBQUM7Z0NBQ3ZELE1BQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztnQ0FDN0MsTUFBTSxXQUFXLEdBQUcsWUFBWSxDQUFDLE9BQU8sSUFBSSxZQUFZLENBQUM7Z0NBQ3pELE1BQU0sUUFBUSxHQUFHLElBQUksV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDO2dDQUN0QyxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEVBQUU7b0NBQ3pCLE1BQU0sSUFBSSxLQUFLLENBQ2IsV0FBVyxRQUFRLG1CQUNqQixPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQ3hCLFFBQVEsV0FBVyxDQUFDLElBQUksRUFBRSxDQUMzQixDQUFDO2lDQUNIO2dDQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxDQUFDOzZCQUNwQzs0QkFBQyxPQUFPLEdBQUcsRUFBRTtnQ0FDWixNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDOzZCQUNuQjt5QkFDRjtxQkFDRjtnQkFDSCxDQUFDLENBQUMsQ0FBQzthQUNKO1NBQ0Y7SUFDSCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQztBQUVGLFdBQVcsRUFBRSxDQUFDIn0=