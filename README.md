# AppSignal for JavaScript

- [AppSignal.com website][appsignal]
- [Documentation][docs]
- [Support][contact]

[![Build Status](https://travis-ci.org/appsignal/appsignal-javascript.svg?branch=develop)](https://travis-ci.org/appsignal/appsignal-javascript) [![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

## Description

## Usage

First, make sure you've installed AppSignal in your application by following the steps in [Installation](#installation).

### Track any error

Catch an error and report it to AppSignal:

```js
try {
  // do something that might throw an error
} catch (error) {
  appsignal.sendError(error)
  // handle the error
}

// You can catch errors asynchronously by listening to Promises...
asyncActionThatReturnsAPromise().catch(error => appsignal.sendError(error))

// ...or by using async/await
async function() {
  try {
    const result = await asyncActionThatReturnsAPromise()
  } catch (error) {
    appsignal.sendError(error)
    // handle the error
  }
}

// ...or in an event handler or callback function
events.on("event", (err) => {
  appsignal.sendError(err)
})
```

**NOTE:** Uncaught exceptions are **not** captured by default. We made the decision to not include this functionality as part of the core library due to the high amount of noise from browser extensions, ad blockers etc. that generally makes libraries such as this less effective.

We recommend using a relevant [integration](#integrations) as a better way to handle exceptions, or, if you _would_ prefer capture uncaught exceptions, you can do so by using the `@appsignal/plugin-window-events` package alongside this one (available soon).

## Installation

First, sign up for an AppSignal account and add the `@appsignal/javascript` package to your `package.json`. Then, run `yarn install`/`npm install`.

You can also add these packages to your `package.json` on the command line:

```bash
yarn add @appsignal/javascript
npm install --save @appsignal/javascript
```

You can then import and use the package in your bundle:

```js
import Appsignal from "@appsignal/javascript" // For ES Module
const Appsignal = require("@appsignal/javascript").default // For CommonJS module

const appsignal = new Appsignal({
  key: "YOUR FRONTEND API KEY"
})
```

It's recommended (although not necessarily required) to use the instance of the `Appsignal` object like a singleton. One way that you can do this is by `export`ing an instance of the library from a `.js`/`.ts` file somewhere in your project.

```js
import Appsignal from "@appsignal/javascript"

export default new Appsignal({
  key: "YOUR FRONTEND API KEY"
}) 
```

Currently, we have no plans to supply a CDN-hosted version of this library.

If you're stuck, feel free to [contact us][contact] for help!

## Integrations

An integration is a module that can consume the `Appsignal` object to catch errors from popular libraries or frameworks. These integrations may come in a variety of different forms, and we aim to generally provide APIs that are consistent, and feel idiomatic to use, with the libraries and/or frameworks that you're using.

These currently include:

* React (beta) - `@appsignal/react`

## Supported browsers

This package can be used in any ECMAScript 5 compatible browser. We aim for compatibility down to Internet Explorer 9 [(roughly 0.22% of all browsers used today)](https://www.w3counter.com/globalstats.php). All browsers older than this can only supported on a "best effort" basis, and full functionality cannot be guaranteed.

When developing, don't forget to check browser support on [Can I Use?](https://caniuse.com/) and the [ES6 Compatibility Table](https://kangax.github.io/compat-table/es6/), and provide the appropriate polyfills or fallbacks. **In a small percentage of browsers, a `Promise` polyfill may be required to use this library.**

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

Also see our [SUPPORT.md file](SUPPORT.md).

[appsignal]: https://appsignal.com
[appsignal-sign-up]: https://appsignal.com/users/sign_up
[contact]: mailto:support@appsignal.com
[coc]: https://docs.appsignal.com/appsignal/code-of-conduct.html
[waffles-page]: https://appsignal.com/waffles
[docs]: http://docs.appsignal.com
[contributing-guide]: http://docs.appsignal.com/appsignal/contributing.html

[semver]: http://semver.org/
