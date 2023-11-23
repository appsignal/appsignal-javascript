---
bump: "patch"
type: "change"
---

Remove a restriction in our `setParams` TypeScript types that did not allow nested objects to be sent as params. It is now possible to send nested objects and arrays as values inside the params object.
