# AppSignal for preact changelog

## 1.0.16

### Changed

- patch - Update @appsignal/core dependency to 1.1.16.
- patch - Update @appsignal/types dependency to 2.1.7.
- patch - Update @appsignal/core dependency to 1.1.16.

### Fixed

- [9281cb8](https://github.com/appsignal/appsignal-javascript/commit/9281cb878d43e6754954bff0a78de45e1a1952ce) patch - In the Preact ErrorBoundary, check if the thrown object is an error. This prevents an error being thrown when the previously thrown error was not an error. Scenarios like `throw new Event("my event")` are now ignored.
- [038d1b8](https://github.com/appsignal/appsignal-javascript/commit/038d1b8beb4042b2610ee3db1c6b3bdb3c9e881f) patch - Fix distributed sourcemaps to include the referenced source properly.

## 1.0.15

- patch - Update @appsignal/types dependency to 2.1.6.

## 1.0.14

- patch - Update @appsignal/types dependency to 2.1.5.

## 1.0.13

- patch - Update @appsignal/types dependency to 2.1.4.

## 1.0.12

- patch - Update @appsignal/types dependency to 2.1.3.

## 1.0.11

- patch - Update @appsignal/types dependency to 2.1.2.

## 1.0.10

- patch - Update @appsignal/types dependency to 2.1.1.

## 1.0.9

- patch - Update @appsignal/types dependency to 2.1.0.
