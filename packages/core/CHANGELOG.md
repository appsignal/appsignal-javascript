# AppSignal Core changelog

## 1.1.21

_Published on 2024-04-22._

### Fixed

- [ebb2adc](https://github.com/appsignal/appsignal-javascript/commit/ebb2adc81aee26b192d4eaca89df823c190bab7e) patch - Bump dependencies to remove vulnerability warning about `node-fetch@2.6.1`. The vulnerability does not apply to AppSignal's usage of it.

## 1.1.20

### Changed

- patch - Update @appsignal/types dependency to 3.0.1.

## 1.1.19

### Changed

- [bb1e8af](https://github.com/appsignal/appsignal-javascript/commit/bb1e8aff2596b8c7b0ca4c0d71ada00a7bb0fd79) patch - Stacktrace is no longer a requirement for an object to be considered an error

## 1.1.18

### Fixed

- [750d9fa](https://github.com/appsignal/appsignal-javascript/commit/750d9fa118f8a166156fd16e1ff99bcc3d93977d) patch - Fix `isError` so that it does not throw an error when the given error is not an object.

## 1.1.17

### Changed

- [449d4d4](https://github.com/appsignal/appsignal-javascript/commit/449d4d40381e7e6c13076732a8b4e7f65f94d5db) patch - Update package metadata to be more up-to-date and to specify the package location in the mono repository.
- patch - Update @appsignal/types dependency to 3.0.0.

## 1.1.16

### Changed

- patch - Update @appsignal/types dependency to 2.1.7.

### Fixed

- [038d1b8](https://github.com/appsignal/appsignal-javascript/commit/038d1b8beb4042b2610ee3db1c6b3bdb3c9e881f) patch - Fix distributed sourcemaps to include the referenced source properly.

## 1.1.15

### Added

- [f46c436](https://github.com/appsignal/appsignal-javascript/commit/f46c4362efd7ca8e414c3cf56c3938ecb7a5b03e) patch - Add internal `isError` utility function to check if an object is an error.

## 1.1.14

- patch - Update @appsignal/types dependency to 2.1.6.

## 1.1.13

- patch - Update @appsignal/types dependency to 2.1.5.

## 1.1.12

- patch - Update @appsignal/types dependency to 2.1.4.

## 1.1.11

- patch - Update @appsignal/types dependency to 2.1.3.

## 1.1.10

- patch - Update @appsignal/types dependency to 2.1.2.

## 1.1.9

- patch - Update @appsignal/types dependency to 2.1.1.

## 1.1.8

- [d0d57e3](https://github.com/appsignal/appsignal-javascript/commit/d0d57e3b6cb559939fb40d3eb83760fdbc8bbad6) patch - Update tslib dependency to 2.3.x.
- patch - Update @appsignal/types dependency to 2.1.0.
