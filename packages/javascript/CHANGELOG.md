# AppSignal for JavaScript changelog

## 1.3.30

_Published on 2024-04-23._

### Changed

- patch - Update @appsignal/core dependency to 1.1.22.

## 1.3.29

_Published on 2024-04-22._

### Changed

- patch - Update @appsignal/core dependency to 1.1.21.

## 1.3.28

### Changed

- [9b9eadc](https://github.com/appsignal/appsignal-javascript/commit/9b9eadcd0a8bfbfe016d46d6c62920ec0536811f) patch - Remove a restriction in our `setParams` TypeScript types that did not allow nested objects to be sent as params. It is now possible to send nested objects and arrays as values inside the params object.
- patch - Update @appsignal/core dependency to 1.1.20.
- patch - Update @appsignal/types dependency to 3.0.1.

## 1.3.27

### Fixed

- [96f46fc](https://github.com/appsignal/appsignal-javascript/commit/96f46fc19edf03e521fa2ab9aebc53977c0526da) patch - Attempt to import the `http` and `https` module dynamically. This fixes
  an issue with Electron, which does not expose the `https` module.
  
  Emit a warning if `NodeTransport` is used but the `https` module fails to be imported.
  
  This allows Electron users to use the AppSignal integration alongside
  with the `electron-fetch` library.

## 1.3.26

### Fixed

- [88ef488](https://github.com/appsignal/appsignal-javascript/commit/88ef48895dcb2ddb92ee9ecf6fb41c05e2e145f5) patch - Fix origin detection on CloudFlare workers

## 1.3.25

### Changed

- patch - Update @appsignal/core dependency to 1.1.19.

## 1.3.24

### Changed

- patch - Update @appsignal/core dependency to 1.1.18.

## 1.3.23

### Changed

- [5fc4962](https://github.com/appsignal/appsignal-javascript/commit/5fc4962feef894a17ab17aaf54c65c5b14f10476) patch - Thrown non-error objects are now ignored instead of being reported with a generic message.

## 1.3.22

### Changed

- [449d4d4](https://github.com/appsignal/appsignal-javascript/commit/449d4d40381e7e6c13076732a8b4e7f65f94d5db) patch - Update package metadata to be more up-to-date and to specify the package location in the mono repository.
- patch - Update @appsignal/core dependency to 1.1.17.
- patch - Update @appsignal/types dependency to 3.0.0.

## 1.3.21

### Changed

- patch - Update @appsignal/core dependency to 1.1.16.
- patch - Update @appsignal/types dependency to 2.1.7.
- patch - Update @appsignal/core dependency to 1.1.16.

### Fixed

- [038d1b8](https://github.com/appsignal/appsignal-javascript/commit/038d1b8beb4042b2610ee3db1c6b3bdb3c9e881f) patch - Fix distributed sourcemaps to include the referenced source properly.

## 1.3.20

### Changed

- patch - Update @appsignal/core dependency to 1.1.15.

## 1.3.19

- [387ee27](https://github.com/appsignal/appsignal-javascript/commit/387ee2711554b5e701be37a9b70d9c01861b6ef5) patch - Fix the reported library version of the JavaScript package. This was stuck on 1.3.12 for the last few releases.
- [e737a7f](https://github.com/appsignal/appsignal-javascript/commit/e737a7f8ca15cbe3577a7209e641b43610f0f68b) patch - Add callback argument to the `sendError` function to allow for more customization of errors sent with `sendError` and `wrap`. The `tags` and `namespace` parameters are now deprecated for both helpers.
  
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
- patch - Update @appsignal/core dependency to 1.1.14.
- patch - Update @appsignal/types dependency to 2.1.6.

## 1.3.18

- patch - Update @appsignal/core dependency to 1.1.13.
- patch - Update @appsignal/types dependency to 2.1.5.

## 1.3.17

- patch - Update @appsignal/core dependency to 1.1.12.
- patch - Update @appsignal/types dependency to 2.1.4.

## 1.3.16

- patch - Update @appsignal/core dependency to 1.1.11.
- patch - Update @appsignal/types dependency to 2.1.3.

## 1.3.15

- patch - Update @appsignal/core dependency to 1.1.10.
- patch - Update @appsignal/types dependency to 2.1.2.

## 1.3.14

- patch - Update @appsignal/core dependency to 1.1.9.
- patch - Update @appsignal/types dependency to 2.1.1.

## 1.3.13

- [d0d57e3](https://github.com/appsignal/appsignal-javascript/commit/d0d57e3b6cb559939fb40d3eb83760fdbc8bbad6) patch - Update tslib dependency to 2.3.x.
- patch - Update @appsignal/core dependency to 1.1.8.
- patch - Update @appsignal/types dependency to 2.1.0.
- patch - Update @appsignal/core dependency to 1.1.8.

## 1.3.12
- Dependency bumps

## 1.3.11
- Dependency bumps

## 1.3.10
- Dependency bumps

## 1.3.9
- Fix `Queue.push` causing a failed compile due to correctness improvement in `tsc`
- Dependency bumps

## 1.3.8
- Dependency bumps

## 1.3.7
- Dependency bumps
- Use @appsignal/types 2.0.0

## 1.3.6
- Add even more detail to default error message in setError if no `error.message` exists
- Dependency bumps

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
