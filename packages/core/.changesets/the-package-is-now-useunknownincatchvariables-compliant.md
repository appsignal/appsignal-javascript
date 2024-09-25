---
bump: patch
type: change
---

The package is now useUnknownInCatchVariables compliant.

Try catch blocks in the package now check for the caught variable to be an instance of `Error` before doing any error-specific operations with it.
