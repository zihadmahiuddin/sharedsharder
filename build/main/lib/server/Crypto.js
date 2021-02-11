"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const tweetnacl_1 = __importDefault(require("tweetnacl"));
const Nonce_1 = __importDefault(require("../util/Nonce"));
dotenv_1.config();
class ServerCrypto {
    constructor(secretKey) {
        const secretKeyBuffer = Buffer.from(secretKey, "hex");
        this.keyPair = tweetnacl_1.default.box.keyPair.fromSecretKey(secretKeyBuffer);
    }
    encrypt(id, payload) {
        if (id === 20100) {
            return payload;
        }
        else if (id === 20103 && !this.session.sessionKey) {
            return payload;
        }
        else if (id === 20103 || id === 20104) {
            return Buffer.from(tweetnacl_1.default.box.after(payload, this.nonce.payload, this.sharedKey));
        }
        else {
            this.nonce.increment(2);
            return Buffer.from(tweetnacl_1.default.box.after(payload, this.nonce.payload, this.sharedKey));
        }
    }
    decrypt(id, encryptedPayload) {
        if (id === 10100) {
            return encryptedPayload;
        }
        else if (id === 10101) {
            this.clientPublicKey = encryptedPayload.slice(0, 32);
            this.nonce = new Nonce_1.default({
                bytes: this.session.sessionKey,
                publicKey: this.clientPublicKey,
                serverKey: this.keyPair.publicKey,
            });
            this.sharedKey = Buffer.from(tweetnacl_1.default.box.before(this.clientPublicKey, this.keyPair.secretKey));
            const payload = Buffer.from(tweetnacl_1.default.box.open.after(encryptedPayload.slice(32), this.nonce.payload, this.sharedKey));
            return payload;
        }
        else {
            this.nonce.increment(2);
            return Buffer.from(tweetnacl_1.default.box.open.after(encryptedPayload, this.nonce.payload, this.sharedKey));
        }
    }
}
exports.default = ServerCrypto;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ3J5cHRvLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9zZXJ2ZXIvQ3J5cHRvLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsbUNBQTJDO0FBQzNDLDBEQUE2QjtBQUc3QiwwREFBa0M7QUFFbEMsZUFBTyxFQUFFLENBQUM7QUFFVixNQUFxQixZQUFZO0lBTy9CLFlBQVksU0FBaUI7UUFDM0IsTUFBTSxlQUFlLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDdEQsSUFBSSxDQUFDLE9BQU8sR0FBRyxtQkFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBQ2pFLENBQUM7SUFFRCxPQUFPLENBQUMsRUFBVSxFQUFFLE9BQWU7UUFDakMsSUFBSSxFQUFFLEtBQUssS0FBSyxFQUFFO1lBQ2hCLE9BQU8sT0FBTyxDQUFDO1NBQ2hCO2FBQU0sSUFBSSxFQUFFLEtBQUssS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUU7WUFDbkQsT0FBTyxPQUFPLENBQUM7U0FDaEI7YUFBTSxJQUFJLEVBQUUsS0FBSyxLQUFLLElBQUksRUFBRSxLQUFLLEtBQUssRUFBRTtZQUN2QyxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQ2hCLG1CQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUM1RCxDQUFDO1NBQ0g7YUFBTTtZQUNMLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3hCLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FDaEIsbUJBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQzVELENBQUM7U0FDSDtJQUNILENBQUM7SUFFRCxPQUFPLENBQUMsRUFBVSxFQUFFLGdCQUF3QjtRQUMxQyxJQUFJLEVBQUUsS0FBSyxLQUFLLEVBQUU7WUFDaEIsT0FBTyxnQkFBZ0IsQ0FBQztTQUN6QjthQUFNLElBQUksRUFBRSxLQUFLLEtBQUssRUFBRTtZQUN2QixJQUFJLENBQUMsZUFBZSxHQUFHLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDckQsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLGVBQUssQ0FBQztnQkFDckIsS0FBSyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVTtnQkFDOUIsU0FBUyxFQUFFLElBQUksQ0FBQyxlQUFlO2dCQUMvQixTQUFTLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTO2FBQ2xDLENBQUMsQ0FBQztZQUNILElBQUksQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FDMUIsbUJBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FDOUQsQ0FBQztZQUNGLE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQ3pCLG1CQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQ2pCLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsRUFDMUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQ2xCLElBQUksQ0FBQyxTQUFTLENBQ2YsQ0FDRixDQUFDO1lBQ0YsT0FBTyxPQUFPLENBQUM7U0FDaEI7YUFBTTtZQUNMLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3hCLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FDaEIsbUJBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FDakIsZ0JBQWdCLEVBQ2hCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUNsQixJQUFJLENBQUMsU0FBUyxDQUNmLENBQ0YsQ0FBQztTQUNIO0lBQ0gsQ0FBQztDQUNGO0FBN0RELCtCQTZEQyJ9