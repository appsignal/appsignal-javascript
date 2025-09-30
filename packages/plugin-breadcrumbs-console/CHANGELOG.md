# AppSignal for plugin-breadcrumbs-console changelog

## 1.1.37

_Published on 2025-09-30._

### Changed

- Update @appsignal/javascript dependency to 1.6.1. (patch)

## 1.1.36

_Published on 2025-07-21._

### Changed

- Update @appsignal/javascript dependency to 1.6.0. (patch)

### Fixed

- Handle RangeError on JSON serialisation. When failing to serialise a value that is too big, catch the error and replace the value with a description of the error. This prevents an infinite loop where attempting to send a span raises an error, which is caught by the window event plugin, which attempts to send a span, raising another error. (patch [f8e2477](https://github.com/appsignal/appsignal-javascript/commit/f8e247776f242560e871de81f35d00d656563ef6))

## 1.1.35

_Published on 2024-11-28._

### Changed

- Update @appsignal/javascript dependency to 1.5.0. (patch)

## 1.1.34

_Published on 2024-11-12._

### Changed

- Update @appsignal/javascript dependency to 1.4.1. (patch)

## 1.1.33

_Published on 2024-10-01._

### Changed

- Update @appsignal/javascript dependency to 1.4.0. (patch)

## 1.1.32

_Published on 2024-09-12._

### Changed

- Update @appsignal/javascript dependency to 1.3.31. (patch)

## 1.1.31

_Published on 2024-04-23._

### Changed

- patch - Update @appsignal/javascript dependency to 1.3.30.

## 1.1.30

_Published on 2024-04-22._

### Changed

- patch - Update @appsignal/javascript dependency to 1.3.29.

## 1.1.29

### Changed

- patch - Update @appsignal/javascript dependency to 1.3.28.
- patch - Update @appsignal/types dependency to 3.0.1.

## 1.1.28

### Changed

- patch - Update @appsignal/javascript dependency to 1.3.27.

## 1.1.27

### Changed

- patch - Update @appsignal/javascript dependency to 1.3.26.

## 1.1.26

### Changed

- patch - Update @appsignal/javascript dependency to 1.3.25.

## 1.1.25

### Changed

- patch - Update @appsignal/javascript dependency to 1.3.24.

## 1.1.24

### Changed

- patch - Update @appsignal/javascript dependency to 1.3.23.

## 1.1.23

### Changed

- [449d4d4](https://github.com/appsignal/appsignal-javascript/commit/449d4d40381e7e6c13076732a8b4e7f65f94d5db) patch - Update package metadata to be more up-to-date and to specify the package location in the mono repository.
- patch - Update @appsignal/javascript dependency to 1.3.22.

## 1.1.22

### Changed

- patch - Update @appsignal/javascript dependency to 1.3.21.
- patch - Update @appsignal/javascript dependency to 1.3.21.
- patch - Update @appsignal/javascript dependency to 1.3.21.
- patch - Update @appsignal/javascript dependency to 1.3.21.

### Fixed

- [038d1b8](https://github.com/appsignal/appsignal-javascript/commit/038d1b8beb4042b2610ee3db1c6b3bdb3c9e881f) patch - Fix distributed sourcemaps to include the referenced source properly.

## 1.1.21

### Changed

- [60b3ee1](https://github.com/appsignal/appsignal-javascript/commit/60b3ee1d6478d03062c6b9c2896623ce1036c93a) patch - Serialise circular references in console arguments, omitting the cyclic value instead of throwing an error.
- patch - Update @appsignal/javascript dependency to 1.3.20.

## 1.1.20

- [7d138c6](https://github.com/appsignal/appsignal-javascript/commit/7d138c67783edc3fa4b2b8b481659c4b8936a57e) patch - Fix the error that was thrown when a circular structure console argument was logged. It will no longer throw the error and instead send a replacement value of the value that could not be send as a JSON value.

## 1.1.19

- patch - Update @appsignal/javascript dependency to 1.3.19.
- patch - Update @appsignal/javascript dependency to 1.3.19.
- patch - Update @appsignal/javascript dependency to 1.3.19.

## 1.1.18

- patch - Update @appsignal/javascript dependency to 1.3.18.
- patch - Update @appsignal/javascript dependency to 1.3.18.

## 1.1.17

- patch - Update @appsignal/javascript dependency to 1.3.17.
- patch - Update @appsignal/javascript dependency to 1.3.17.

## 1.1.16

- patch - Update @appsignal/javascript dependency to 1.3.16.
- patch - Update @appsignal/javascript dependency to 1.3.16.

## 1.1.15

- patch - Update @appsignal/javascript dependency to 1.3.15.
- patch - Update @appsignal/javascript dependency to 1.3.15.

## 1.1.14

- patch - Update @appsignal/javascript dependency to 1.3.14.
- patch - Update @appsignal/javascript dependency to 1.3.14.

## 1.1.13

- patch - Update @appsignal/javascript dependency to 1.3.13.
- patch - Update @appsignal/javascript dependency to 1.3.13.
- patch - Update @appsignal/javascript dependency to 1.3.13.
- patch - Update @appsignal/javascript dependency to 1.3.13.
