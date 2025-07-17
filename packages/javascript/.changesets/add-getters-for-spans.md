---
bump: patch
type: add
---

Add getters for spans. Use the `getAction`, `getNamespace`, `getError`, `getTags`, `getParams`, `getBreadcrumbs`, and `getEnvironment` methods to access data about the current span. This can be used to make decisions based on the span's properties within decorators or overrides.
