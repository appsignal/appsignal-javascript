# AppSignal for react changelog

## 1.0.19

### Removed

- [a958e07](https://github.com/appsignal/appsignal-javascript/commit/a958e0752f1816f0a9643e905a5a143f8e74c9ea) patch - Remove error type check on ErrorBoundary. This is now done in the `setError` helper instead for all function calls.

## 1.0.18

### Changed

- [449d4d4](https://github.com/appsignal/appsignal-javascript/commit/449d4d40381e7e6c13076732a8b4e7f65f94d5db) patch - Update package metadata to be more up-to-date and to specify the package location in the mono repository.
- patch - Update @appsignal/core dependency to 1.1.17.
- patch - Update @appsignal/types dependency to 3.0.0.

## 1.0.17

### Changed

- patch - Update @appsignal/core dependency to 1.1.16.
- patch - Update @appsignal/types dependency to 2.1.7.
- patch - Update @appsignal/core dependency to 1.1.16.

### Fixed

- [038d1b8](https://github.com/appsignal/appsignal-javascript/commit/038d1b8beb4042b2610ee3db1c6b3bdb3c9e881f) patch - Fix distributed sourcemaps to include the referenced source properly.

## 1.0.16

### Changed

- patch - Update @appsignal/core dependency to 1.1.15.

### Fixed

- [f46c436](https://github.com/appsignal/appsignal-javascript/commit/f46c4362efd7ca8e414c3cf56c3938ecb7a5b03e) patch - In the React ErrorBoundary, check if the thrown object is an error. This prevents an error being thrown when the previously thrown error was not an error. Scenarios like `throw new Event("my event")` are now ignored.

## 1.0.15

### Added

- [e030546](https://github.com/appsignal/appsignal-javascript/commit/e0305463f9623581d26a02b8273737b9126bbe90) patch - Update @appsignal/react package to allow React 17 installs.

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
