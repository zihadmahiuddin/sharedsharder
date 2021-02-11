/// <reference types="node" />
export default class PacketReceiver {
    private buffer;
    private packet;
    constructor();
    receiveFullPacket(data: Buffer): Promise<Buffer>;
}
