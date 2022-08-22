---
bump: "patch"
type: "fix"
---

Fix the behaviour of the unhandled rejection handler when the reason for the rejection event (the value passed to `reject` in the promise callback) is an `Error`, showing the message and stacktrace for that error.
