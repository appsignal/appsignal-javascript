---
bump: patch
type: fix
---

Fix matching on backtrace paths containing spaces.

When using `matchBacktracePaths`, when a backtrace line path contains a space, it will now match correctly against the whole path.