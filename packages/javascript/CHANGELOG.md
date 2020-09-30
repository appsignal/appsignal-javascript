# Changelog

## 1.3.5
- Dependency bumps
- Improve the default error message if an invalid error object is passed to `span.setError` (#424)
- Test coverage improvements

## 1.3.4
- Dependency bumps
- Ignore node `https` module in browser compilation. Fixes #389 and #386.
- Move `@appsignal/types` to dependency of `@appsignal/javascript`. Fixes #389 and #386.

## 1.3.3
- Dependency bumps

## 1.3.2
- Display "development mode" message via `console.info` rather than `console.warn`
- Dependency bumps

## 1.3.1
- Dependency bumps

## 1.3.0
- Dependency bumps
- Don't send spans and rethrow when no key is supplied to constructor (#274)
- Add support for running inside Node.js (#275)
- Fix "`navigator` is undefined" error and improve handling of `window` object
- Changes to internal type names

Blog post: https://blog.appsignal.com/2020/04/30/javascript-error-tracking-version-1-3-0.html

## 1.2.1
- Dependency bumps

## 1.2.0
- Dependency bumps
- Add tags and namespace params to `appsignal.wrap()` method 

## 1.1.2
- Dependency bumps

## 1.1.1
- Fix package dependency issue in `@appsignal/javascript` package

## 1.1.0
- Dependency bumps
- Split some reusable logic into `@appsignal/core` package
- Fix errors when run with in React Native (#130)
- Add ignored errors list (#134)

(v.1.1.0 was marked as deprecated due to a bad release)

## 1.0.1
- Dependency bumps, no new features
