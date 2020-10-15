export default class PacketReceiver {
  private buffer: Buffer;
  private packet: Buffer;

  constructor() {
    this.buffer = null;
    this.packet = null;
  }

  receiveFullPacket(data: Buffer) {
    return new Promise<Buffer>((resolve, reject) => {
      try {
        let payloadLength = null;

        if (this.buffer) {
          this.buffer = Buffer.concat([this.buffer, data]);
        } else {
          this.buffer = data;
        }

        while (this.buffer && this.buffer.length) {
          if (this.packet && this.packet.length) {
            payloadLength = this.packet.readUInt32BE(2);

            if (this.buffer.length >= payloadLength) {
              if (this.packet) {
                this.packet = Buffer.concat([
                  this.packet,
                  this.buffer.slice(0, payloadLength),
                ]);
              } else {
                this.packet = this.buffer.slice(0, payloadLength);
              }

              resolve(this.packet);
              this.packet = null;

              this.buffer = this.buffer.slice(payloadLength);
            } else {
              break;
            }
          } else if (this.buffer.length >= 6) {
            this.packet = this.buffer.slice(0, 6);
            this.buffer = this.buffer.slice(6);
          }
        }
      } catch (err) {
        reject(err);
      }
    });
  }
}
