/**
 * Modified version of https://github.com/NinoDiscord/Nino/blob/e64f6f2dacafe1e4721753946d826224bd982383/src/structures/Logger.ts
 */
import leeks from "leeks.js";
declare type LogMessage = (string | object | any[])[];
export default class Logger {
    static colors: typeof leeks.colors;
    private static getDate;
    private static write;
    static info(...message: LogMessage): void;
    static warn(...message: LogMessage): void;
    static error(...message: LogMessage): void;
    static debug(...message: LogMessage): void;
}
export {};
