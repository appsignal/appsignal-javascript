# AppSignal types changelog

## 2.1.7

### Fixed

- [038d1b8](https://github.com/appsignal/appsignal-javascript/commit/038d1b8beb4042b2610ee3db1c6b3bdb3c9e881f) patch - Fix distributed sourcemaps to include the referenced source properly.

## 2.1.6

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

## 2.1.5

- [2ad4ccb](https://github.com/appsignal/appsignal-javascript/commit/2ad4ccbe26aa5c820eca5f4c9c204dc71d26cc82) patch - Make sendError callback argument optional for Node.js Tracer.

## 2.1.4

- [3d03c0b](https://github.com/appsignal/appsignal-javascript/commit/3d03c0b6b7490d3d574dbfdaf190045d9983bb74) patch - Add sendError helper to Tracer
  
  The sendError() function gives the ability to track errors without
  the need of a root span present in the given context.

## 2.1.3

- [8bc4082](https://github.com/appsignal/appsignal-javascript/commit/8bc408201293a6e551516caa7b20c812f94a7808) patch - Deprecate addError helper for spans
  
  Errors are now added through the tracer in the Node.js integration
  using the `setError` function. `span.addError()` is not used anymore.

## 2.1.2

- [91708f8](https://github.com/appsignal/appsignal-javascript/commit/91708f841c5c6440dbc6878c855f2e3b30e0d2bd) patch - Rename addError helper functions to setError in NodeJS

## 2.1.1

- [9b7f5c3](https://github.com/appsignal/appsignal-javascript/commit/9b7f5c3aadf03937f9ea2738ccd558a3f93ae90c) patch - Tracer rootSpan does not return undefined anymore, but returns a NoopSpan instead.

## 2.1.0

- [ec9e2ea](https://github.com/appsignal/appsignal-javascript/commit/ec9e2eaa1466fb4ddb92a4c0b53702435541ecb4) minor - Add root span support to tracer interface
