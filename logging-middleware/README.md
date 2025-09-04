# Logging Middleware

Reusable Log function to send structured logs to the evaluation test server.

Usage (JS/TS):

import Log from "logging-middleware" // or relative path

await Log("backend", "error", "handler", "received string, expected bool")

Notes:
- The function sends a POST to the test server and attempts to attach an auth token.
- Allowed stacks, levels and packages are validated as per the challenge.
