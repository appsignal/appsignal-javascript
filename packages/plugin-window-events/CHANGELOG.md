# AppSignal for plugin-window-events changelog

## 1.0.25

_Published on 2025-07-21._

### Changed

- Update @appsignal/javascript dependency to 1.6.0. (patch)

### Fixed

- Handle RangeError on JSON serialisation. When failing to serialise a value that is too big, catch the error and replace the value with a description of the error. This prevents an infinite loop where attempting to send a span raises an error, which is caught by the window event plugin, which attempts to send a span, raising another error. (patch [f8e2477](https://github.com/appsignal/appsignal-javascript/commit/f8e247776f242560e871de81f35d00d656563ef6))

## 1.0.24

_Published on 2024-11-12._

### Changed

- Update @appsignal/core dependency to 1.1.24. (patch)

## 1.0.23

_Published on 2024-10-01._

### Changed

- Update @appsignal/core dependency to 1.1.23. (patch)

## 1.0.22

_Published on 2024-04-23._

### Changed

- patch - Update @appsignal/core dependency to 1.1.22.

## 1.0.21

_Published on 2024-04-22._

### Changed

- patch - Update @appsignal/core dependency to 1.1.21.

## 1.0.20

### Changed

- patch - Update @appsignal/core dependency to 1.1.20.
- patch - Update @appsignal/types dependency to 3.0.1.

## 1.0.19

### Changed

- patch - Update @appsignal/core dependency to 1.1.19.

## 1.0.18

### Changed

- patch - Update @appsignal/core dependency to 1.1.18.

### Fixed

- [750d9fa](https://github.com/appsignal/appsignal-javascript/commit/750d9fa118f8a166156fd16e1ff99bcc3d93977d) patch - Fix the behaviour of the unhandled rejection handler when the reason for the rejection event (the value passed to `reject` in the promise callback) is an `Error`, showing the message and stacktrace for that error.

## 1.0.17

### Changed

- [449d4d4](https://github.com/appsignal/appsignal-javascript/commit/449d4d40381e7e6c13076732a8b4e7f65f94d5db) patch - Update package metadata to be more up-to-date and to specify the package location in the mono repository.
- patch - Update @appsignal/types dependency to 3.0.0.

## 1.0.16

### Changed

- patch - Update @appsignal/types dependency to 2.1.7.

### Fixed

- [038d1b8](https://github.com/appsignal/appsignal-javascript/commit/038d1b8beb4042b2610ee3db1c6b3bdb3c9e881f) patch - Fix distributed sourcemaps to include the referenced source properly.

## 1.0.15

### Changed

- [37809a5](https://github.com/appsignal/appsignal-javascript/commit/37809a54789cd29cb37f3465f22ba410773bb82c) patch - Serialise circular references in window errors, omitting the cyclic value instead of throwing an error.

## 1.0.14

- patch - Update @appsignal/types dependency to 2.1.6.

## 1.0.13

- patch - Update @appsignal/types dependency to 2.1.5.

## 1.0.12

- patch - Update @appsignal/types dependency to 2.1.4.

## 1.0.11

- patch - Update @appsignal/types dependency to 2.1.3.

## 1.0.10

- patch - Update @appsignal/types dependency to 2.1.2.

## 1.0.9

- patch - Update @appsignal/types dependency to 2.1.1.

## 1.0.8

- patch - Update @appsignal/types dependency to 2.1.0.

## 1.0.7

- [513b8bc](https://github.com/appsignal/appsignal-javascript/commit/513b8bca43480af1c8a3aa01d3224ed5d3909bbf) patch - Fix issue with JavaScript objects that, when serialized to JSON, would cause a circular structure error.
