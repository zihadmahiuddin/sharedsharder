"use strict";
/**
 * Modified version of https://github.com/NinoDiscord/Nino/blob/e64f6f2dacafe1e4721753946d826224bd982383/src/structures/Logger.ts
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
const leeks_js_1 = __importDefault(require("leeks.js"));
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["INFO"] = 0] = "INFO";
    LogLevel[LogLevel["WARN"] = 1] = "WARN";
    LogLevel[LogLevel["ERROR"] = 2] = "ERROR";
    LogLevel[LogLevel["REDIS"] = 3] = "REDIS";
    LogLevel[LogLevel["DEBUG"] = 4] = "DEBUG";
    LogLevel[LogLevel["DATABASE"] = 5] = "DATABASE";
})(LogLevel || (LogLevel = {}));
var LogSeverity;
(function (LogSeverity) {
    LogSeverity[LogSeverity["NONE"] = 0] = "NONE";
    LogSeverity[LogSeverity["ERROR"] = 1] = "ERROR";
})(LogSeverity || (LogSeverity = {}));
class Logger {
    static getDate() {
        const now = new Date();
        const seconds = `0${now.getSeconds()}`.slice(-2);
        const minutes = `0${now.getMinutes()}`.slice(-2);
        const hours = `0${now.getHours()}`.slice(-2);
        const ampm = now.getHours() >= 12 ? "PM" : "AM";
        return `[${hours}:${minutes}:${seconds} ${ampm}]`;
    }
    static write(level, severity, ...message) {
        let lvlText;
        switch (level) {
            case LogLevel.INFO:
                {
                    lvlText = this.colors.cyan(`[INFO/${process.pid}]`);
                }
                break;
            case LogLevel.WARN:
                {
                    lvlText = this.colors.yellow(`[WARN/${process.pid}]`);
                }
                break;
            case LogLevel.ERROR:
                {
                    lvlText = this.colors.red(`[ERROR/${process.pid}]`);
                }
                break;
            case LogLevel.REDIS:
                {
                    lvlText = leeks_js_1.default.hex("#D82C20", `[REDIS/${process.pid}]`);
                }
                break;
            case LogLevel.DEBUG:
                {
                    lvlText = leeks_js_1.default.hex("#987DC5", `[DEBUG/${process.pid}]`);
                }
                break;
            case LogLevel.DATABASE:
                {
                    lvlText = leeks_js_1.default.rgb([88, 150, 54], `[MONGODB/${process.pid}]`);
                }
                break;
        }
        const msg = message
            .map((m) => m instanceof Array
            ? `[${m.join(", ")}]`
            : m instanceof Object
                ? util_1.inspect(m)
                : m)
            .join("\n");
        const output = severity === LogSeverity.ERROR ? process.stderr : process.stdout;
        output.write(`${this.colors.gray(this.getDate())} ${lvlText} => ${msg}\n`);
    }
    static info(...message) {
        this.write(LogLevel.INFO, LogSeverity.NONE, ...message);
    }
    static warn(...message) {
        this.write(LogLevel.WARN, LogSeverity.NONE, ...message);
    }
    static error(...message) {
        this.write(LogLevel.ERROR, LogSeverity.ERROR, ...message);
    }
    static debug(...message) {
        if (process.env.NODE_ENV !== "development")
            return;
        this.write(LogLevel.DEBUG, LogSeverity.NONE, ...message);
    }
}
exports.default = Logger;
Logger.colors = leeks_js_1.default.colors;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9nZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi91dGlsL0xvZ2dlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7O0dBRUc7Ozs7O0FBRUgsK0JBQStCO0FBQy9CLHdEQUE2QjtBQUc3QixJQUFLLFFBT0o7QUFQRCxXQUFLLFFBQVE7SUFDWCx1Q0FBSSxDQUFBO0lBQ0osdUNBQUksQ0FBQTtJQUNKLHlDQUFLLENBQUE7SUFDTCx5Q0FBSyxDQUFBO0lBQ0wseUNBQUssQ0FBQTtJQUNMLCtDQUFRLENBQUE7QUFDVixDQUFDLEVBUEksUUFBUSxLQUFSLFFBQVEsUUFPWjtBQUVELElBQUssV0FHSjtBQUhELFdBQUssV0FBVztJQUNkLDZDQUFJLENBQUE7SUFDSiwrQ0FBSyxDQUFBO0FBQ1AsQ0FBQyxFQUhJLFdBQVcsS0FBWCxXQUFXLFFBR2Y7QUFFRCxNQUFxQixNQUFNO0lBR2pCLE1BQU0sQ0FBQyxPQUFPO1FBQ3BCLE1BQU0sR0FBRyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7UUFFdkIsTUFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqRCxNQUFNLE9BQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2pELE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0MsTUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFFaEQsT0FBTyxJQUFJLEtBQUssSUFBSSxPQUFPLElBQUksT0FBTyxJQUFJLElB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