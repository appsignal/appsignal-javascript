# AppSignal for preact changelog

## 1.0.25

_Published on 2024-11-12._

### Changed

- Update @appsignal/core dependency to 1.1.24. (patch)

## 1.0.24

_Published on 2024-10-01._

### Changed

- Update @appsignal/core dependency to 1.1.23. (patch)

## 1.0.23

_Published on 2024-04-23._

### Changed

- patch - Update @appsignal/core dependency to 1.1.22.

## 1.0.22

_Published on 2024-04-22._

### Changed

- patch - Update @appsignal/core dependency to 1.1.21.

## 1.0.21

### Changed

- patch - Update @appsignal/core dependency to 1.1.20.
- patch - Update @appsignal/types dependency to 3.0.1.

## 1.0.20

### Changed

- patch - Update @appsignal/core dependency to 1.1.19.

## 1.0.19

### Changed

- patch - Update @appsignal/core dependency to 1.1.18.

## 1.0.18

### Removed

- [a33e5fd](https://github.com/appsignal/appsignal-javascript/commit/a33e5fdbadb3a56f6cece03e2906a900bb2763a3) patch - Remove error type check on ErrorBoundary. This is now done in the `setError` helper instead for all function calls.

## 1.0.17

### Changed

- [449d4d4](https://github.com/appsignal/appsignal-javascript/commit/449d4d40381e7e6c13076732a8b4e7f65f94d5db) patch - Update package metadata to be more up-to-date and to specify the package location in the mono repository.
- patch - Update @appsignal/core dependency to 1.1.17.
- patch - Update @appsignal/types dependency to 3.0.0.

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
