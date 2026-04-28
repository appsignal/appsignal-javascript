---
bump: patch
type: fix
---

Skip push requests when the browser is offline.

When `navigator.onLine` reports that the browser is offline, the Push API client no longer attempts to send spans. The request is rejected before hitting the transport, which stops runaway retries that could crash tabs when a flood of errors was produced without connectivity.
