---
bump: "patch"
---

Add callback argument to the `sendError` function to allow for more customization of errors sent with `sendError` and `wrap`. The `tags` and `namespace` parameters are now deprecated for both helpers.

```js
// Deprecated behavior
appsignal.sendError(
  new Error("sendError with tags and namespace argument"),
  { tag1: "value 1", tag2: "value 2" },
  "custom_namespace"
);

// New behavior
appsignal.sendError(
  new Error("sendError with callback argument"),
  function(span) {
    span.setAction("SendErrorTestAction");
    span.setNamespace("custom_namespace");
    span.setTags({ tag1: "value 1", tag2: "value 2" });
  }
);
```
