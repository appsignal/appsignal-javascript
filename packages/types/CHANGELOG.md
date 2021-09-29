# AppSignal types changelog

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
