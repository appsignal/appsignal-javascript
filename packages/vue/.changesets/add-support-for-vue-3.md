---
bump: "minor"
---

Add support for Vue 3

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
