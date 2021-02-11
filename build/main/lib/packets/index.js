"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Factory = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const Logger_1 = __importDefault(require("../util/Logger"));
exports.Factory = new Map();
const loadPackets = () => {
    const packetsPath = __dirname;
    if (!fs_1.default.existsSync(packetsPath))
        return;
    fs_1.default.readdir(packetsPath, (err, files) => {
        if (err)
            Logger_1.default.error(err);
        else {
            for (const file of files) {
                const filePath = path_1.default.join(packetsPath, file);
                const stats = fs_1.default.statSync(filePath);
                if (!stats.isDirectory())
                    continue;
                fs_1.default.readdir(filePath, (err, packetFolder) => {
                    if (err)
                        Logger_1.default.error(err);
                    else {
                        for (const packetFile of packetFolder) {
                            if (!packetFile.endsWith(".js"))
                                continue;
                            try {
                                const packetFilePath = path_1.default.join(filePath, packetFile);
                                const packetModule = require(packetFilePath);
                                const PacketClass = packetModule.default || packetModule;
                                const packetId = new PacketClass().id;
                                if (exports.Factory.has(packetId)) {
                                    throw new Error(`Same ID ${packetId} found for both ${exports.Factory.get(packetId).name} and ${PacketClass.name}`);
                                }
                                exports.Factory.set(packetId, PacketClass);
                            }
                            catch (err) {
                                Logger_1.default.error(err);
                            }
                        }
                    }
                });
            }
        }
    });
};
loadPackets();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL3BhY2tldHMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsNENBQW9CO0FBQ3BCLGdEQUF3QjtBQUN4Qiw0REFBb0M7QUFFdkIsUUFBQSxPQUFPLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUVqQyxNQUFNLFdBQVcsR0FBRyxHQUFHLEVBQUU7SUFDdkIsTUFBTSxXQUFXLEdBQUcsU0FBUyxDQUFDO0lBQzlCLElBQUksQ0FBQyxZQUFFLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQztRQUFFLE9BQU87SUFFeEMsWUFBRSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLEVBQUU7UUFDckMsSUFBSSxHQUFHO1lBQUUsZ0JBQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDdEI7WUFDSCxLQUFLLE1BQU0sSUFBSSxJQUFJLEtBQUssRUFBRTtnQkFDeEIsTUFBTSxRQUFRLEdBQUcsY0FBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQzlDLE1BQU0sS0FBSyxHQUFHLFlBQUUsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ3BDLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFO29CQUFFLFNBQVM7Z0JBRW5DLFlBQUUsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUMsR0FBRyxFQUFFLFlBQVksRUFBRSxFQUFFO29CQUN6QyxJQUFJLEdBQUc7d0JBQUUsZ0JBQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7eUJBQ3RCO3dCQUNILEtBQUssTUFBTSxVQUFVLElBQUksWUFBWSxFQUFFOzRCQUNyQyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUM7Z0NBQUUsU0FBUzs0QkFDMUMsSUFBSTtnQ0FDRixNQUFNLGNBQWMsR0FBRyxjQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxVQUFVLENBQUMsQ0FBQztnQ0FDdkQsTUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO2dDQUM3QyxNQUFNLFdBQVcsR0FBRyxZQUFZLENBQUMsT0FBTyxJQUFJLFlBQVksQ0FBQztnQ0FDekQsTUFBTSxRQUFRLEdBQUcsSUFBSSxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUM7Z0NBQ3RDLElBQUksZUFBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRTtvQ0FDekIsTUFBTSxJQUFJLEtBQUssQ0FDYixXQUFXLFFBQVEsbUJBQ2pCLGVBQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsSUFDeEIsUUFBUSxXQUFXLENBQUMsSUFBSSxFQUFFLENBQzNCLENBQUM7aUNBQ0g7Z0NBQ0QsZUFBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsV0FBVyxDQUFDLENBQUM7NkJBQ3BDOzRCQUFDLE9BQU8sR0FBRyxFQUFFO2dDQUNaLGdCQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDOzZCQUNuQjt5QkFDRjtxQkFDRjtnQkFDSCxDQUFDLENBQUMsQ0FBQzthQUNKO1NBQ0Y7SUFDSCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQztBQUVGLFdBQVcsRUFBRSxDQUFDIn0=