"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tweetnacl_1 = __importDefault(require("tweetnacl"));
const Blake2B_1 = __importDefault(require("./Blake2B"));
const Logger_1 = __importDefault(require("./Logger"));
class Nonce {
    constructor(options) {
        if (typeof options === "string") {
            this.payload = Buffer.from(options, "hex");
        }
        else if (options instanceof Buffer) {
            this.payload = options;
        }
        else if ((options === null || options === void 0 ? void 0 : options.publicKey) && (options === null || options === void 0 ? void 0 : options.serverKey)) {
            const b2 = new Blake2B_1.default(tweetnacl_1.default.box.nonceLength);
            if (options === null || options === void 0 ? void 0 : options.bytes) {
                b2.update(options.bytes);
            }
            b2.update(options.publicKey);
            b2.update(options.serverKey);
            this.payload = Buffer.from(b2.digest());
        }
        else {
            this.payload = Buffer.from(tweetnacl_1.default.randomBytes(tweetnacl_1.default.box.nonceLength));
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
            Logger_1.default.error(val, increment.toString(), err);
        }
    }
}
exports.default = Nonce;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTm9uY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL3V0aWwvTm9uY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSwwREFBNkI7QUFFN0Isd0RBQWdDO0FBQ2hDLHNEQUE4QjtBQVE5QixNQUFxQixLQUFLO0lBR3hCLFlBQVksT0FBd0M7UUFDbEQsSUFBSSxPQUFPLE9BQU8sS0FBSyxRQUFRLEVBQUU7WUFDL0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztTQUM1QzthQUFNLElBQUksT0FBTyxZQUFZLE1BQU0sRUFBRTtZQUNwQyxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztTQUN4QjthQUFNLElBQUksQ0FBQSxPQUFPLGFBQVAsT0FBTyx1QkFBUCxPQUFPLENBQUUsU0FBUyxNQUFJLE9BQU8sYUFBUCxPQUFPLHVCQUFQLE9BQU8sQ0FBRSxTQUFTLENBQUEsRUFBRTtZQUNuRCxNQUFNLEVBQUUsR0FBRyxJQUFJLGlCQUFPLENBQUMsbUJBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7WUFFN0MsSUFBSSxPQUFPLGFBQVAsT0FBTyx1QkFBUCxPQUFPLENBQUUsS0FBSyxFQUFFO2dCQUNsQixFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUMxQjtZQUVELEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzdCLEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBRTdCLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztTQUN6QzthQUFNO1lBQ0wsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLG1CQUFJLENBQUMsV0FBVyxDQUFDLG1CQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7U0FDcEU7SUFDSCxDQUFDO0lBRUQsU0FBUyxDQUFDLFNBQWlCO1FBQ3pCLElBQUksR0FBRyxDQUFDO1FBQ1IsSUFBSTtZQUNGLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNsQyxHQUFHLElBQUksS0FBSyxDQUFDO1lBQ2IsSUFBSSxHQUFHLEdBQUcsU0FBUyxJQUFJLEtBQUssRUFBRTtnQkFDNUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO2FBQ3pDO2lCQUFNO2dCQUNMLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLEdBQUcsR0FBRyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUM7YUFDL0M7U0FDRjtRQUFDLE9BQU8sR0FBRyxFQUFFO1lBQ1osZ0JBQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLFNBQVMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQztTQUM5QztJQUNILENBQUM7Q0FDRjtBQXRDRCx3QkFzQ0MifQ==