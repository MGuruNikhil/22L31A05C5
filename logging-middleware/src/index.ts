import axios from "axios";
import { TEST_SERVER_BASE } from "./config/constants";
import { getAuthToken } from "./services/auth";

export type Stack = "backend" | "frontend";
export type Level = "debug" | "info" | "warn" | "error" | "fatal";

export type PackageName =
    | "cache"
    | "controller"
    | "cron_job"
    | "domain"
    | "handler"
    | "repository"
    | "route"
    | "service"
    | "api"
    | "component"
    | "page"
    | "state"
    | "style"
    | "auth"
    | "config"
    | "middleware"
    | "utils";

const ALLOWED_STACKS = ["backend", "frontend"] as const;
const ALLOWED_LEVELS = ["debug", "info", "warn", "error", "fatal"] as const;

function isAllowed<T extends ReadonlyArray<string>>(val: string, allowed: T): val is T[number] {
    return (allowed as readonly string[]).includes(val);
}

async function sendLog(body: { stack: string; level: string; package: string; message: string }) {
    const token = await getAuthToken();
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await axios.post(`${TEST_SERVER_BASE}/logs`, body, { headers });
    return res.data;
}

export async function Log(
    stack: Stack | string,
    level: Level | string,
    pkg: PackageName | string,
    message: string
) {
    const s = String(stack).toLowerCase();
    const l = String(level).toLowerCase();
    const p = String(pkg).toLowerCase();

    if (!isAllowed(s, ALLOWED_STACKS)) {
        throw new Error(`invalid stack: ${stack}`);
    }
    if (!isAllowed(l, ALLOWED_LEVELS)) {
        throw new Error(`invalid level: ${level}`);
    }

    const allowedPackages = [
        "cache",
        "controller",
        "cron_job",
        "domain",
        "handler",
        "repository",
        "route",
        "service",
        "api",
        "component",
        "page",
        "state",
        "style",
        "auth",
        "config",
        "middleware",
        "utils",
    ];

    if (!allowedPackages.includes(p)) {
        throw new Error(`invalid package: ${pkg}`);
    }

    if (typeof message !== "string" || message.length === 0) {
        throw new Error("message must be a non-empty string");
    }

    const payload = { stack: s as Stack, level: l as Level, package: p as PackageName, message };

    return sendLog(payload);
}

export default Log;