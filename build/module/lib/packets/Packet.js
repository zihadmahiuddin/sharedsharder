export default class Packet {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGFja2V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9wYWNrZXRzL1BhY2tldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFJQSxNQUFNLENBQUMsT0FBTyxPQUFnQixNQUFNO0lBS2xDLElBQUksZ0JBQWdCO1FBQ2xCLE9BQU8sTUFBTSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBRUQsSUFBSSxnQkFBZ0I7UUFDbEIsT0FBTyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFFRCxNQUFNLEtBQUksQ0FBQztJQUVYLE1BQU0sS0FBSSxDQUFDO0lBRVgsV0FBVyxLQUFJLENBQUM7SUFDaEIsY0FBYyxLQUFJLENBQUM7SUFFbkIsTUFBTSxDQUFDLGdCQUFnQixDQUFDLEVBQVU7UUFDaEMsT0FBTyxFQUFFLElBQUksS0FBSyxJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUM7SUFDbkMsQ0FBQztJQUVELE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFVO1FBQ2hDLE9BQU8sRUFBRSxJQUFJLEtBQUssSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDO0lBQ25DLENBQUM7Q0FDRiJ9