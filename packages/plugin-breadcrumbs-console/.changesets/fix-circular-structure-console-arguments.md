---
bump: "patch"
---

Fix the error that was thrown when a circular structure console argument was logged. It will no longer throw the error and instead send a replacement value of the value that could not be send as a JSON value.
