---
bump: "patch"
type: "fix"
---

Attempt to import the `http` and `https` module dynamically. This fixes
an issue with Electron, which does not expose the `https` module.

Emit a warning if `NodeTransport` is used but the `https` module fails to be imported.

This allows Electron users to use the AppSignal integration alongside
with the `electron-fetch` library.
