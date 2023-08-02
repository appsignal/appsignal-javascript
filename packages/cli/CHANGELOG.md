# AppSignal CLI changelog

## 1.2.6

### Fixed

- [cf0ec71](https://github.com/appsignal/appsignal-javascript/commit/cf0ec7158a3a0907fba5f6adc60089606b1465bb) patch - Support yarn workspaces on CLI commands

## 1.2.5

### Added

- [daabd61](https://github.com/appsignal/appsignal-javascript/commit/daabd617f9d2e7aae3ac408e75d2ca6572d07699) patch - Fail if the file passed to flag doesn't exists

## 1.2.4

### Added

- [9627ecd](https://github.com/appsignal/appsignal-javascript/commit/9627ecd9d8c70e8cdaa57c94f164c5565d59b85d) patch - Add the config flag to the diagnose command to specify to the diagnose the user's AppSignal configuration file
  if it is not the default one.

## 1.2.3

### Fixed

- [cefb331](https://github.com/appsignal/appsignal-javascript/commit/cefb331e88bd433cb49a1a3c761f0e5e6d94dff4) patch - Report errors when running the diagnose command

## 1.2.2

### Changed

- [3e483cf](https://github.com/appsignal/appsignal-javascript/commit/3e483cf1d3840d6b28df19c144c90211a677ec25) patch - Update Node.js documentation links. The docs have moved to a v3 sub section.

## 1.2.1

### Changed

- patch - Update @appsignal/core dependency to 1.1.19.

## 1.2.0

### Added

- [7492997](https://github.com/appsignal/appsignal-javascript/commit/74929977f8c961180fd1077363cd19fba085af87) minor - Installer writes appsignal.js configuration file

## 1.1.18

### Changed

- patch - Update @appsignal/core dependency to 1.1.18.

## 1.1.17

### Fixed

- [d58aa41](https://github.com/appsignal/appsignal-javascript/commit/d58aa41ceb3a4a6850467299392776c846698864) patch - Fix the send report CLI flags for diagnose tool. The documented `--send-report` and `--no-send-report` flags will now work.

## 1.1.16

### Added

- [39438e9](https://github.com/appsignal/appsignal-javascript/commit/39438e9f0649177fe55243054e8b0e8de1bd4515) patch - Add demo command. Run `npx @appsignal/cli demo` in your Node.js project to
  send sample demonstration data to AppSignal.

## 1.1.15

### Changed

- [449d4d4](https://github.com/appsignal/appsignal-javascript/commit/449d4d40381e7e6c13076732a8b4e7f65f94d5db) patch - Update package metadata to be more up-to-date and to specify the package location in the mono repository.
- patch - Update @appsignal/core dependency to 1.1.17.

## 1.1.14

### Changed

- patch - Update @appsignal/core dependency to 1.1.16.
- patch - Update @appsignal/core dependency to 1.1.16.

### Fixed

- [038d1b8](https://github.com/appsignal/appsignal-javascript/commit/038d1b8beb4042b2610ee3db1c6b3bdb3c9e881f) patch - Fix distributed sourcemaps to include the referenced source properly.

## 1.1.13

### Changed

- patch - Update @appsignal/core dependency to 1.1.15.

## 1.1.12

- [69f6b73](https://github.com/appsignal/appsignal-javascript/commit/69f6b73bf09b7b73075f23f0580c2d86a2ba4c03) patch - Fix the "install" and "diagnose" cli commands by including the bin wrapper in the distributed package.

## 1.1.11

- patch - Update @appsignal/core dependency to 1.1.14.

## 1.1.10

- patch - Update @appsignal/core dependency to 1.1.13.

## 1.1.9

- patch - Update @appsignal/core dependency to 1.1.12.

## 1.1.8

- patch - Update @appsignal/core dependency to 1.1.11.

## 1.1.7

- patch - Update @appsignal/core dependency to 1.1.10.

## 1.1.6

- patch - Update @appsignal/core dependency to 1.1.9.

## 1.1.5

- [91f745c](https://github.com/appsignal/appsignal-javascript/commit/91f745c781d68d9726ed4ed10f51da309a2ab4e7) patch - Remove unused tslib dependency.
- patch - Update @appsignal/core dependency to 1.1.8.
- patch - Update @appsignal/core dependency to 1.1.8.
