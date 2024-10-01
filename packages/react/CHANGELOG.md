# AppSignal for react changelog

## 1.0.27

_Published on 2024-10-01._

### Changed

- Update @appsignal/core dependency to 1.1.23. (patch)

## 1.0.26

_Published on 2024-07-03._

### Added

- Add a span override prop to the `ErrorBoundary` and `LegacyBoundary` components.

  Pass an override function to the error boundary component in order to set properties, such as tags, params or breadcrumbs, in the error span that will be sent to AppSignal.

  The override function is only called when an error is about to be sent. This allows you to only perform expensive computation to add information to the error when an error will actually be reported.

  When defined within a component, the function should be memoized with `useCallback` to prevent unnecessary re-renders:

  ```jsx
    export default const SomeComponent = ({ someProp }) => {
      const override = useCallback((span) => {
        span.setTags({ someProp })
      }, [someProp]);

      return (
        <ErrorBoundary override={override}>
          { /* Your component here */ }
        </ErrorBoundary>
      )
    }
  ```

  (patch [2ae20c2](https://github.com/appsignal/appsignal-javascript/commit/2ae20c279bf8ef416019f523a56ecd35edbd23bc))

## 1.0.25

_Published on 2024-04-23._

### Changed

- patch - Update @appsignal/core dependency to 1.1.22.

## 1.0.24

_Published on 2024-04-22._

### Changed

- patch - Update @appsignal/core dependency to 1.1.21.

## 1.0.23

### Changed

- patch - Update @appsignal/core dependency to 1.1.20.
- patch - Update @appsignal/types dependency to 3.0.1.

## 1.0.22

### Changed

- patch - Update @appsignal/core dependency to 1.1.19.

## 1.0.21

### Changed

- [1640241](https://github.com/appsignal/appsignal-javascript/commit/164024199a5e1d8099105eda62623ebbeeceb62a) patch - Bump peer dependency to allow React 18.2
- patch - Update @appsignal/core dependency to 1.1.18.

## 1.0.20

### Added

- [4b636f7](https://github.com/appsignal/appsignal-javascript/commit/4b636f759040fd1ae15d2305b09a442dfb566597) patch - Add React 18 compatibility

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
