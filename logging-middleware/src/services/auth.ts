import axios from "axios";
import { TEST_SERVER_BASE } from "../config/constants";

let cachedToken: string | null = null;
let tokenExpiry: number | null = null;

export async function getAuthToken(): Promise<string | null> {
    try {
        if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
            return cachedToken;
        }

        const response = await axios.post(`${TEST_SERVER_BASE}/auth`, {
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
    } catch (err) {
        return null;
    }
}