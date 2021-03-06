/**
 * Modified version of https://github.com/NinoDiscord/Nino/blob/e64f6f2dacafe1e4721753946d826224bd982383/src/structures/Logger.ts
 */
import { inspect } from "util";
import leeks from "leeks.js";
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
export default class Logger {
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
                    lvlText = leeks.hex("#D82C20", `[REDIS/${process.pid}]`);
                }
                break;
            case LogLevel.DEBUG:
                {
                    lvlText = leeks.hex("#987DC5", `[DEBUG/${process.pid}]`);
                }
                break;
            case LogLevel.DATABASE:
                {
                    lvlText = leeks.rgb([88, 150, 54], `[MONGODB/${process.pid}]`);
                }
                break;
        }
        const msg = message
            .map((m) => m instanceof Array
            ? `[${m.join(", ")}]`
            : m instanceof Object
                ? inspect(m)
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
Logger.colors = leeks.colors;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9nZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi91dGlsL0xvZ2dlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7R0FFRztBQUVILE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDL0IsT0FBTyxLQUFLLE1BQU0sVUFBVSxDQUFDO0FBRzdCLElBQUssUUFPSjtBQVBELFdBQUssUUFBUTtJQUNYLHVDQUFJLENBQUE7SUFDSix1Q0FBSSxDQUFBO0lBQ0oseUNBQUssQ0FBQTtJQUNMLHlDQUFLLENBQUE7SUFDTCx5Q0FBSyxDQUFBO0lBQ0wsK0NBQVEsQ0FBQTtBQUNWLENBQUMsRUFQSSxRQUFRLEtBQVIsUUFBUSxRQU9aO0FBRUQsSUFBSyxXQUdKO0FBSEQsV0FBSyxXQUFXO0lBQ2QsNkNBQUksQ0FBQTtJQUNKLCtDQUFLLENBQUE7QUFDUCxDQUFDLEVBSEksV0FBVyxLQUFYLFdBQVcsUUFHZjtBQUVELE1BQU0sQ0FBQyxPQUFPLE9BQU8sTUFBTTtJQUdqQixNQUFNLENBQUMsT0FBTztRQUNwQixNQUFNLEdBQUcsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO1FBRXZCLE1BQU0sT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakQsTUFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqRCxNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdDLE1BQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFB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