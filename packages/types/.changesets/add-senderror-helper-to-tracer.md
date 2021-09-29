---
bump: "patch"
---

Add sendError helper to Tracer

The sendError() function gives the ability to track errors without
the need of a root span present in the given context.
