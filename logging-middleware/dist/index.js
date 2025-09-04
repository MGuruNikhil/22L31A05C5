"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log = Log;
const axios_1 = __importDefault(require("axios"));
const constants_1 = require("./config/constants");
const auth_1 = require("./services/auth");
const ALLOWED_STACKS = ["backend", "frontend"];
const ALLOWED_LEVELS = ["debug", "info", "warn", "error", "fatal"];
function isAllowed(val, allowed) {
    return allowed.includes(val);
}
async function sendLog(body) {
    const token = await (0, auth_1.getAuthToken)();
    const headers = {
        "Content-Type": "application/json",
    };
    if (token)
        headers["Authorization"] = `Bearer ${token}`;
    const res = await axios_1.default.post(`${constants_1.TEST_SERVER_BASE}/logs`, body, { headers });
    return res.data;
}
/**
 * Log a message to the Test Server.
 * Usage: Log("backend", "error", "handler", "some message")
 */
async function Log(stack, level, pkg, message) {
    // validate types and lowercase inputs as server expects lower-case
    const s = String(stack).toLowerCase();
    const l = String(level).toLowerCase();
    const p = String(pkg).toLowerCase();
    if (!isAllowed(s, ALLOWED_STACKS)) {
        throw new Error(`invalid stack: ${stack}`);
    }
    if (!isAllowed(l, ALLOWED_LEVELS)) {
        throw new Error(`invalid level: ${level}`);
    }
    // basic package whitelist check (both frontend and backend allowed packages included)
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
    // assemble payload and send
    const payload = { stack: s, level: l, package: p, message };
    return sendLog(payload);
}
exports.default = Log;
// setAuthToken removed — tokens are obtained via the middleware's auth flow.
