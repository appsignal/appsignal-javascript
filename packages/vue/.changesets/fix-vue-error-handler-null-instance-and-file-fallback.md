---
bump: patch
type: fix
---

Handle null instances and fall back to the SFC filename in the Vue error handler.

Vue 3 invokes `app.config.errorHandler` with a null instance for errors raised outside a component context; the handler now reports those as `[unknown Vue component]` instead of throwing away the original error with a `TypeError` of its own. For components without an explicit `name` or `<script setup>` `__name`, the handler now falls back to the basename of `$options.__file` (set by vue-loader; in production builds only when its `exposeFilename` option is enabled), so errors group per component instead of all under `[unknown Vue component]`.
