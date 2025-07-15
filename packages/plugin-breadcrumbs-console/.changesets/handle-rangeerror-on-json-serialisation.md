---
bump: patch
type: fix
---

Handle RangeError on JSON serialisation. When failing to serialise a value that is too big, catch the error and replace the value with a description of the error. This prevents an infinite loop where attempting to send a span raises an error, which is caught by the window event plugin, which attempts to send a span, raising another error.
