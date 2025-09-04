"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthToken = getAuthToken;
const axios_1 = __importDefault(require("axios"));
const constants_1 = require("../config/constants");
let cachedToken = null;
let tokenExpiry = null;
async function getAuthToken() {
    try {
        // Env override removed: do not allow supplying a token via environment variables.
        if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
            return cachedToken;
        }
        const response = await axios_1.default.post(`${constants_1.TEST_SERVER_BASE}/auth`, {
            email: "gurunikhilmangaraju@gmail.com",
            name: "Guru Nikhil Mangaraju",
            rollNo: "22L31A05C5",
            accessCode: "YzuJeU",
            clientID: "1154fb8d-b47d-482d-817a-392f4249faf4",
            clientSecret: "QXqUzjQGpsUKjaZx"
        });
        const data = response.data || {};
        cachedToken = data.access_token || null;
        tokenExpiry = data.expires_in ? Date.now() + data.expires_in * 1000 : null;
        return cachedToken;
    }
    catch (err) {
        return null;
    }
}
// setAuthToken intentionally removed: tokens must be obtained via the middleware's auth flow.
