/**
 * Modified version of https://github.com/NinoDiscord/Nino/blob/e64f6f2dacafe1e4721753946d826224bd982383/src/structures/Logger.ts
 */

import { inspect } from "util";
import leeks from "leeks.js";

type LogMessage = (string | object | any[])[];
enum LogLevel {
  INFO,
  WARN,
  ERROR,
  REDIS,
  DEBUG,
  DATABASE,
}

enum LogSeverity {
  NONE,
  ERROR,
}

export default class Logger {
  public static colors: typeof leeks.colors = leeks.colors;

  private static getDate() {
    const now = new Date();

    const seconds = `0${now.getSeconds()}`.slice(-2);
    const minutes = `0${now.getMinutes()}`.slice(-2);
    const hours = `0${now.getHours()}`.slice(-2);
    const ampm = now.getHours() >= 12 ? "PM" : "AM";

    return `[${hours}:${minutes}:${seconds} ${ampm}]`;
  }

  private static write(
    level: LogLevel,
    severity: LogSeverity,
    ...message: LogMessage
  ) {
    let lvlText!: string;
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
      .map((m) =>
        m instanceof Array
          ? `[${m.join(", ")}]`
          : m instanceof Object
          ? inspect(m)
          : (m as string)
      )
      .join("\n");

    const output =
      severity === LogSeverity.ERROR ? process.stderr : process.stdout;
    output.write(`${this.colors.gray(this.getDate())} ${lvlText} => ${msg}\n`);
  }

  static info(...message: LogMessage) {
    this.write(LogLevel.INFO, LogSeverity.NONE, ...message);
  }

  static warn(...message: LogMessage) {
    this.write(LogLevel.WARN, LogSeverity.NONE, ...message);
  }

  static error(...message: LogMessage) {
    this.write(LogLevel.ERROR, LogSeverity.ERROR, ...message);
  }

  static debug(...message: LogMessage) {
    if (process.env.NODE_ENV !== "development") return;

    this.write(LogLevel.DEBUG, LogSeverity.NONE, ...message);
  }
}
