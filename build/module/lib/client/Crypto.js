import nacl from "tweetnacl";
import Nonce from "../util/Nonce";
export default class ClientCrypto {
    constructor(serverPublicKey) {
        this.serverPublicKey = serverPublicKey;
    }
    encrypt(id, payload) {
        if (id === 10100) {
            return payload;
        }
        else if (id === 10101) {
            this.keyPair = nacl.box.keyPair();
            this.nonce = new Nonce({
                bytes: this.session.sessionKey,
                publicKey: this.keyPair.publicKey,
                serverKey: this.serverPublicKey,
            });
            this.sharedKey = Buffer.from(nacl.box.before(this.serverPublicKey, this.keyPair.secretKey));
            return Buffer.concat([
                this.keyPair.publicKey,
                Buffer.from(nacl.box.after(payload, this.nonce.payload, this.sharedKey)),
            ]);
        }
        else {
            this.nonce.increment(2);
            return Buffer.from(nacl.box.after(payload, this.nonce.payload, this.sharedKey));
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
            const payload = Buffer.from(nacl.box.open.after(encryptedPayload, this.nonce.payload, this.sharedKey));
            return payload;
        }
        else {
            this.nonce.increment(2);
            return Buffer.from(nacl.box.open.after(encryptedPayload, this.nonce.payload, this.sharedKey));
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ3J5cHRvLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9jbGllbnQvQ3J5cHRvLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sSUFBSSxNQUFNLFdBQVcsQ0FBQztBQUc3QixPQUFPLEtBQUssTUFBTSxlQUFlLENBQUM7QUFFbEMsTUFBTSxDQUFDLE9BQU8sT0FBTyxZQUFZO0lBTy9CLFlBQW1CLGVBQXVCO1FBQXZCLG9CQUFlLEdBQWYsZUFBZSxDQUFRO0lBQUcsQ0FBQztJQUU5QyxPQUFPLENBQUMsRUFBVSxFQUFFLE9BQWU7UUFDakMsSUFBSSxFQUFFLEtBQUssS0FBSyxFQUFFO1lBQ2hCLE9BQU8sT0FBTyxDQUFDO1NBQ2hCO2FBQU0sSUFBSSxFQUFFLEtBQUssS0FBSyxFQUFFO1lBQ3ZCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNsQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDO2dCQUNyQixLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVO2dCQUM5QixTQUFTLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTO2dCQUNqQyxTQUFTLEVBQUUsSUFBSSxDQUFDLGVBQWU7YUFDaEMsQ0FBQyxDQUFDO1lBQ0gsSUFBSSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUMxQixJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQzlELENBQUM7WUFDRixPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUM7Z0JBQ25CLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUztnQkFDdEIsTUFBTSxDQUFDLElBQUksQ0FDVCxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUM1RDthQUNGLENBQUMsQ0FBQztTQUNKO2FBQU07WUFDTCxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN4QixPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQ2hCLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQzVELENBQUM7U0FDSDtJQUNILENBQUM7SUFFRCxPQUFPLENBQUMsRUFBVSxFQUFFLGdCQUF3QjtRQUMxQyxJQUFJLEVBQUUsS0FBSyxLQUFLLEVBQUU7WUFDaEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztZQUM1RCxPQUFPLGdCQUFnQixDQUFDO1NBQ3pCO2FBQU0sSUFBSSxFQUFFLEtBQUssS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUU7WUFDbkQsT0FBTyxnQkFBZ0IsQ0FBQztTQUN6QjthQUFNLElBQUksRUFBRSxLQUFLLEtBQUssSUFBSSxFQUFFLEtBQUssS0FBSyxFQUFFO1lBQ3ZDLE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQ3pCLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FDakIsZ0JBQWdCLEVBQ2hCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUNsQixJQUFJLENBQUMsU0FBUyxDQUNmLENBQ0YsQ0FBQztZQUNGLE9BQU8sT0FBTyxDQUFDO1NBQ2hCO2FBQU07WUFDTCxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN4QixPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQ2hCLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FDakIsZ0JBQWdCLEVBQ2hCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUNsQixJQUFJLENBQUMsU0FBUyxDQUNmLENBQ0YsQ0FBQztTQUNIO0lBQ0gsQ0FBQztDQUNGIn0=