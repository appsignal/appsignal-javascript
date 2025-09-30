---
bump: patch
type: add
---

Allow functions as backtrace matchers. Alongside regular expressions, you can also provide custom functions to match and replace paths in the backtrace:

```javascript
const appsignal = new Appsignal({
  // ...
  matchBacktracePaths: [(path) => {
    if (path.indexOf("/bundle/") !== -1) {
      return "bundle.js"
    }
  }]
})
```

The function must take a backtrace line path as an argument. When the function returns a non-empty string, the string will be used as the path for that backtrace line. Otherwise, the path will be left unchanged.
