# `@appsignal/vue`

- [AppSignal.com website][appsignal]
- [Documentation][docs]
- [Support][contact]

The `@appsignal/javascript` integration for Vue v2.6+. 

## Installation

Add the  `@appsignal/vue` and `@appsignal/javascript` packages to your `package.json`. Then, run `yarn install`/`npm install`.

You can also add these packages to your `package.json` on the command line:

```
yarn add @appsignal/javascript @appsignal/vue
npm install --save @appsignal/javascript @appsignal/vue
```

## Usage

### `Vue.config.errorHandler` in Vue 2

The default Vue integration is a function that binds to the `Vue.config.errorHandler` hook. In a new app created using `@vue/cli`, your `main.js`/`.ts` file would look something like this:

```js
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import Appsignal from "@appsignal/javascript"
import { errorHandler } from "@appsignal/vue"

const appsignal = new Appsignal({ 
  key: "YOUR FRONTEND API KEY"
})

Vue.config.errorHandler = errorHandler(appsignal, Vue)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
```
### `app.config.errorHandler` in Vue 3

The default Vue integration is a function that binds to the `app.config.errorHandler` hook. In a new app created using `@vue/cli`, your `main.js`/`.ts` file would look something like this:

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

## Development

### Installation

This repository is a Lerna-managed monorepo, containing packages (located in the `/packages` directory) that map to separate `npm` modules.

To install the dependencies:

```bash
yarn install
lerna bootstrap
```

You can then run the following to start the compiler in _watch_ mode. This automatically compiles both the ES Module and CommonJS variants:

```bash
yarn build:watch
```

You can also build the library without watching the directory:

```
yarn build        # build both CJS and ESM
yarn build:cjs    # just CJS
yarn build:esm    # just ESM
```

### Testing

The tests for this library use [Jest](https://jestjs.io) as the test runner. Once you've installed the dependencies, you can run the following command in the root of this repository to run the tests for all packages, or in the directory of a package to run only the tests pertaining to that package:

```bash
yarn test
```

### Versioning

This repo uses [Semantic Versioning][semver] (often referred to as _semver_). Each package in the repository is versioned independently from one another.

@TODO: define how this works once we know more about releasing

## Contributing

Thinking of contributing to this repo? Awesome! 🚀

Please follow our [Contributing guide][contributing-guide] in our documentation and follow our [Code of Conduct][coc].

Also, we would be very happy to send you Stroopwafles. Have look at everyone we send a package to so far on our [Stroopwafles page][waffles-page].

## Support

[Contact us][contact] and speak directly with the engineers working on AppSignal. They will help you get set up, tweak your code and make sure you get the most out of using AppSignal.

[appsignal]: https://appsignal.com
[appsignal-sign-up]: https://appsignal.com/users/sign_up
[contact]: mailto:support@appsignal.com
[coc]: https://docs.appsignal.com/appsignal/code-of-conduct.html
[waffles-page]: https://appsignal.com/waffles
[docs]: http://docs.appsignal.com
[contributing-guide]: http://docs.appsignal.com/appsignal/contributing.html

[semver]: http://semver.org/
