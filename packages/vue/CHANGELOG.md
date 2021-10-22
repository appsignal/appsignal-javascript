# AppSignal for vue changelog

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
