"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Packet {
    get isClientToServer() {
        return Packet.isClientToServer(this.id);
    }
    get isServerToClient() {
        return Packet.isServerToClient(this.id);
    }
    decode() { }
    encode() { }
    processSend() { }
    processReceive() { }
    static isClientToServer(id) {
        return id >= 10000 && id < 20000;
    }
    static isServerToClient(id) {
        return id >= 20000 && id < 30000;
    }
}
exports.default = Packet;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGFja2V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9wYWNrZXRzL1BhY2tldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUlBLE1BQThCLE1BQU07SUFLbEMsSUFBSSxnQkFBZ0I7UUFDbEIsT0FBTyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFFRCxJQUFJLGdCQUFnQjtRQUNsQixPQUFPLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDMUMsQ0FBQztJQUVELE1BQU0sS0FBSSxDQUFDO0lBRVgsTUFBTSxLQUFJLENBQUM7SUFFWCxXQUFXLEtBQUksQ0FBQztJQUNoQixjQUFjLEtBQUksQ0FBQztJQUVuQixNQUFNLENBQUMsZ0JBQWdCLENBQUMsRUFBVTtRQUNoQyxPQUFPLEVBQUUsSUFBSSxLQUFLLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQztJQUNuQyxDQUFDO0lBRUQsTUFBTSxDQUFDLGdCQUFnQixDQUFDLEVBQVU7UUFDaEMsT0FBTyxFQUFFLElBQUksS0FBSyxJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUM7SUFDbkMsQ0FBQztDQUNGO0FBM0JELHlCQTJCQyJ9