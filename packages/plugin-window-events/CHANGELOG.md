# AppSignal for plugin-window-events changelog

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
