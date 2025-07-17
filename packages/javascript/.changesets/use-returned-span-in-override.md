---
bump: patch
type: fix
---

Use returned span in override. Fix an issue where the span returned from an override function was not being used, instead using the original span. This led to confusing behaviour when the override created a new span instead of modifying the original one.

To avoid breaking existing overrides that rely on modifying the original span without returning it, if the override function does not return a span, the original span will still be used.
