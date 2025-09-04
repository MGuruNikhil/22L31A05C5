// Small browser-safe logging shim used by the frontend during development.
// The real `logging-middleware` package is a Node/TS package and is not
// safe to import directly into the browser when not built. Use this shim
// to avoid runtime bundling errors in Vite.

export async function Log(stack, level, pkg, message) {
  try {
    // Keep logs lightweight in the browser; print to console for devs.
    // Avoid network calls here to keep the frontend isolated from server-side
    // logging concerns.
    // Normalize to help search in devtools.
    const ts = new Date().toISOString();
    // eslint-disable-next-line no-console
    console.debug(`[Log ${ts}]`, { stack, level, pkg, message });
  } catch (e) {
    // swallow errors to avoid breaking the app
  }
}

export default Log;
