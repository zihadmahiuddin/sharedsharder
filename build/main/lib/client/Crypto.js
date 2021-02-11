"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tweetnacl_1 = __importDefault(require("tweetnacl"));
const Nonce_1 = __importDefault(require("../util/Nonce"));
class ClientCrypto {
    constructor(serverPublicKey) {
        this.serverPublicKey = serverPublicKey;
    }
    encrypt(id, payload) {
        if (id === 10100) {
            return payload;
        }
        else if (id === 10101) {
            this.keyPair = tweetnacl_1.default.box.keyPair();
            this.nonce = new Nonce_1.default({
                bytes: this.session.sessionKey,
                publicKey: this.keyPair.publicKey,
                serverKey: this.serverPublicKey,
            });
            this.sharedKey = Buffer.from(tweetnacl_1.default.box.before(this.serverPublicKey, this.keyPair.secretKey));
            return Buffer.concat([
                this.keyPair.publicKey,
                Buffer.from(tweetnacl_1.default.box.after(payload, this.nonce.payload, this.sharedKey)),
            ]);
        }
        else {
            this.nonce.increment(2);
            return Buffer.from(tweetnacl_1.default.box.after(payload, this.nonce.payload, this.sharedKey));
        }
    }
    decrypt(id, encryptedPayload) {
        if (id === 20100) {
            this.session.sessionKey = Buffer.concat([encryptedPayload]);
            return encryptedPayload;
        }
        else if (id === 20103 && !this.session.sessionKey) {
            return encryptedPayload;
        }
        else if (id === 20103 || id === 20104) {
            const payload = Buffer.from(tweetnacl_1.default.box.open.after(encryptedPayload, this.nonce.payload, this.sharedKey));
            return payload;
        }
        else {
            this.nonce.increment(2);
            return Buffer.from(tweetnacl_1.default.box.open.after(encryptedPayload, this.nonce.payload, this.sharedKey));
        }
    }
}
exports.default = ClientCrypto;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ3J5cHRvLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9jbGllbnQvQ3J5cHRvLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsMERBQTZCO0FBRzdCLDBEQUFrQztBQUVsQyxNQUFxQixZQUFZO0lBTy9CLFlBQW1CLGVBQXVCO1FBQXZCLG9CQUFlLEdBQWYsZUFBZSxDQUFRO0lBQUcsQ0FBQztJQUU5QyxPQUFPLENBQUMsRUFBVSxFQUFFLE9BQWU7UUFDakMsSUFBSSxFQUFFLEtBQUssS0FBSyxFQUFFO1lBQ2hCLE9BQU8sT0FBTyxDQUFDO1NBQ2hCO2FBQU0sSUFBSSxFQUFFLEtBQUssS0FBSyxFQUFFO1lBQ3ZCLElBQUksQ0FBQyxPQUFPLEdBQUcsbUJBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDbEMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLGVBQUssQ0FBQztnQkFDckIsS0FBSyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVTtnQkFDOUIsU0FBUyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUztnQkFDakMsU0FBUyxFQUFFLElBQUksQ0FBQyxlQUFlO2FBQ2hDLENBQUMsQ0FBQztZQUNILElBQUksQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FDMUIsbUJBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FDOUQsQ0FBQztZQUNGLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQztnQkFDbkIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTO2dCQUN0QixNQUFNLENBQUMsSUFBSSxDQUNULG1CQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUM1RDthQUNGLENBQUMsQ0FBQztTQUNKO2FBQU07WUFDTCxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN4QixPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQ2hCLG1CQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUM1RCxDQUFDO1NBQ0g7SUFDSCxDQUFDO0lBRUQsT0FBTyxDQUFDLEVBQVUsRUFBRSxnQkFBd0I7UUFDMUMsSUFBSSxFQUFFLEtBQUssS0FBSyxFQUFFO1lBQ2hCLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7WUFDNUQsT0FBTyxnQkFBZ0IsQ0FBQztTQUN6QjthQUFNLElBQUksRUFBRSxLQUFLLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFO1lBQ25ELE9BQU8sZ0JBQWdCLENBQUM7U0FDekI7YUFBTSxJQUFJLEVBQUUsS0FBSyxLQUFLLElBQUksRUFBRSxLQUFLLEtBQUssRUFBRTtZQUN2QyxNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUN6QixtQkFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUNqQixnQkFBZ0IsRUFDaEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQ2xCLElBQUksQ0FBQyxTQUFTLENBQ2YsQ0FDRixDQUFDO1lBQ0YsT0FBTyxPQUFPLENBQUM7U0FDaEI7YUFBTTtZQUNMLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3hCLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FDaEIsbUJBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FDakIsZ0JBQWdCLEVBQ2hCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUNsQixJQUFJLENBQUMsU0FBUyxDQUNmLENBQ0YsQ0FBQztTQUNIO0lBQ0gsQ0FBQztDQUNGO0FBOURELCtCQThEQyJ9