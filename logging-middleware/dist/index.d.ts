export type Stack = "backend" | "frontend";
export type Level = "debug" | "info" | "warn" | "error" | "fatal";
export type PackageName = "cache" | "controller" | "cron_job" | "domain" | "handler" | "repository" | "route" | "service" | "api" | "component" | "page" | "state" | "style" | "auth" | "config" | "middleware" | "utils";
/**
 * Log a message to the Test Server.
 * Usage: Log("backend", "error", "handler", "some message")
 */
export declare function Log(stack: Stack | string, level: Level | string, pkg: PackageName | string, message: string): Promise<any>;
export default Log;
