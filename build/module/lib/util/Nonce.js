import nacl from "tweetnacl";
import Blake2B from "./Blake2B";
import Logger from "./Logger";
export default class Nonce {
    constructor(options) {
        if (typeof options === "string") {
            this.payload = Buffer.from(options, "hex");
        }
        else if (options instanceof Buffer) {
            this.payload = options;
        }
        else if (options?.publicKey && options?.serverKey) {
            const b2 = new Blake2B(nacl.box.nonceLength);
            if (options?.bytes) {
                b2.update(options.bytes);
            }
            b2.update(options.publicKey);
            b2.update(options.serverKey);
            this.payload = Buffer.from(b2.digest());
        }
        else {
            this.payload = Buffer.from(nacl.randomBytes(nacl.box.nonceLength));
        }
    }
    increment(increment) {
        let val;
        try {
            val = this.payload.readInt16LE(0);
            val %= 32767;
            if (val + increment >= 65536) {
                this.payload.writeInt16LE(increment, 0);
            }
            else {
                this.payload.writeInt16LE(val + increment, 0);
            }
        }
        catch (err) {
            Logger.error(val, increment.toString(), err);
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTm9uY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL3V0aWwvTm9uY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxJQUFJLE1BQU0sV0FBVyxDQUFDO0FBRTdCLE9BQU8sT0FBTyxNQUFNLFdBQVcsQ0FBQztBQUNoQyxPQUFPLE1BQU0sTUFBTSxVQUFVLENBQUM7QUFROUIsTUFBTSxDQUFDLE9BQU8sT0FBTyxLQUFLO0lBR3hCLFlBQVksT0FBd0M7UUFDbEQsSUFBSSxPQUFPLE9BQU8sS0FBSyxRQUFRLEVBQUU7WUFDL0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztTQUM1QzthQUFNLElBQUksT0FBTyxZQUFZLE1BQU0sRUFBRTtZQUNwQyxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztTQUN4QjthQUFNLElBQUksT0FBTyxFQUFFLFNBQVMsSUFBSSxPQUFPLEVBQUUsU0FBUyxFQUFFO1lBQ25ELE1BQU0sRUFBRSxHQUFHLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7WUFFN0MsSUFBSSxPQUFPLEVBQUUsS0FBSyxFQUFFO2dCQUNsQixFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUMxQjtZQUVELEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzdCLEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBRTdCLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztTQUN6QzthQUFNO1lBQ0wsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1NBQ3BFO0lBQ0gsQ0FBQztJQUVELFNBQVMsQ0FBQyxTQUFpQjtRQUN6QixJQUFJLEdBQUcsQ0FBQztRQUNSLElBQUk7WUFDRixHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEMsR0FBRyxJQUFJLEtBQUssQ0FBQztZQUNiLElBQUksR0FBRyxHQUFHLFNBQVMsSUFBSSxLQUFLLEVBQUU7Z0JBQzVCLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQzthQUN6QztpQkFBTTtnQkFDTCxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxHQUFHLEdBQUcsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO2FBQy9DO1NBQ0Y7UUFBQyxPQUFPLEdBQUcsRUFBRTtZQUNaLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLFNBQVMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQztTQUM5QztJQUNILENBQUM7Q0FDRiJ9