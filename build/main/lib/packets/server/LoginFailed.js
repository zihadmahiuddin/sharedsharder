"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = __importDefault(require("../../util/Logger"));
const Packet_1 = __importDefault(require("../Packet"));
class LoginFailedPacket extends Packet_1.default {
    constructor() {
        super(...arguments);
        this.id = 20103;
    }
    decode() {
        this.code = this.payload.readByte();
        this.message = this.payload.readIString();
    }
    encode() {
        this.payload.writeByte(this.code);
        this.payload.writeIString(this.message);
    }
    processReceive() {
        Logger_1.default.error(`Login Failed: ${this.code}${this.message ? `, ${this.message}` : ""}`);
        if (this.code === 2) {
            process.exit(0);
        }
    }
}
exports.default = LoginFailedPacket;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9naW5GYWlsZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbGliL3BhY2tldHMvc2VydmVyL0xvZ2luRmFpbGVkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsK0RBQXVDO0FBQ3ZDLHVEQUErQjtBQUUvQixNQUFxQixpQkFBa0IsU0FBUSxnQkFBTTtJQUFyRDs7UUFDRSxPQUFFLEdBQUcsS0FBSyxDQUFDO0lBdUJiLENBQUM7SUFsQkMsTUFBTTtRQUNKLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNwQyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDNUMsQ0FBQztJQUVELE1BQU07UUFDSixJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFFRCxjQUFjO1FBQ1osZ0JBQU0sQ0FBQyxLQUFLLENBQ1YsaUJBQWlCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUN2RSxDQUFDO1FBQ0YsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRTtZQUNuQixPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2pCO0lBQ0gsQ0FBQztDQUNGO0FBeEJELG9DQXdCQyJ9