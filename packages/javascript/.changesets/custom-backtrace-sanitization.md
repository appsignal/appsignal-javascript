---
bump: minor
type: add
---

Allow custom backtrace sanitization.

> **Warning:** This is an advanced feature meant for specific use cases. For most use cases, you should not need this functionality. If in doubt, leave `matchBacktracePaths` unset.
> 
> **Using `matchBacktracePaths` will cause public sourcemap detection to fail.** If using `matchBacktracePaths`, use our private sourcemap API to upload sourcemaps to AppSignal.

Some applications, such as those running on Electron or React Native environments, emit backtrace lines containing paths relative to the device in which the application is running.

The unpredictability of these backtrace line paths interferes with the correct functioning of backtrace error grouping, and makes it impossible to upload sourcemaps for these files using our private sourcemap API, as it is not possible to know the expected path beforehand.

You can set the `matchBacktracePaths` configuration to a list of one or more regexes, which will be used to attempt to match the relevant section of the backtrace line path.

For example, suppose you have an Electron application, which your users install at unpredictable locations. Your backtrace line paths may look something like this, with the username changing for each installation:

```sh
/Users/${USERNAME}/Applications/CoolBeans.app/Contents/Resources/app/index.js
```

To ignore these parts of the path that are not predictable, you can configure AppSignal to ignore everything before the `app` folder as follows:

```js
const appsignal = new AppSignal({
  matchBacktracePaths: [
    new RegExp("CoolBeans\\.app/Contents/Resources/(.*)$")
  ]
})
```

If set, the `matchBacktracePaths` configuration option must contain a regular expression, or an array of one or more regular expressions, which attempt to match the whole backtrace line path. These regular expressions must have one or more match groups, such as `(.*)` in the example above, which attempt to match against the relevant segments of the backtrace line path.

AppSignal will attempt to match the whole backtrace line path against these regular expressions in order. If any of the regular expression matches and produces a match group, AppSignal will replace the path in the backtrace line with the matched segment.

Make sure your regular expressions provide unique and stable points of reference in the path, such as `CoolBeans.app/Contents/Resources` in the example above.