# AppSignal for vue changelog

## 1.1.2

### Changed

- [449d4d4](https://github.com/appsignal/appsignal-javascript/commit/449d4d40381e7e6c13076732a8b4e7f65f94d5db) patch - Update package metadata to be more up-to-date and to specify the package location in the mono repository.
- patch - Update @appsignal/types dependency to 3.0.0.

## 1.1.1

### Changed

- patch - Update @appsignal/types dependency to 2.1.7.

### Fixed

- [038d1b8](https://github.com/appsignal/appsignal-javascript/commit/038d1b8beb4042b2610ee3db1c6b3bdb3c9e881f) patch - Fix distributed sourcemaps to include the referenced source properly.

## 1.1.0

- [66f074c](https://github.com/appsignal/appsignal-javascript/commit/66f074c3e94a209870246771a9d17c13db705d37) minor - Add support for Vue 3
  
  Vue 3.0+ is now supported. Previously we were relying only on the 2.0 Vue object to install the error handling function. Now we support the two latest major versions of the framework.
  
  To install AppSignal error tracking:
  
  ```js
  import { createApp } from 'vue'
  import App from './App.vue'
  import Appsignal from "@appsignal/javascript"
  import { errorHandler } from "@appsignal/vue"
  const appsignal = new Appsignal({
    key: "YOUR FRONTEND API KEY"
  })
  const app = createApp(App)
  app.config.errorHandler = errorHandler(appsignal, app)
  app.mount('#app')
  ```
  
  More info on [README.md](https://github.com/appsignal/appsignal-javascript/tree/main/packages/vue)

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
