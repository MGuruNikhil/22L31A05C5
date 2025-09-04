# Shortener Service

Simple Express-based URL shortener for the evaluation.

How to run

1. From repository root, install dependencies for the shortener service:

   npm --prefix shortener-service install

2. Start the service:

   npm --prefix shortener-service start

By default the server listens on port 3000.

Notes

- This service uses the local `logging-middleware` package (file dependency).
- Data is stored in-memory; restarting the service clears links.
