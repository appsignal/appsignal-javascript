# `@appsignal/webpack`

- [AppSignal.com website][appsignal]
- [Documentation][docs]
- [Support][contact]

The `@appsignal/javascript` integration for Webpack v4+. 

## Installation

Add the  `@appsignal/webpack` packages to your `package.json`. Then, run `yarn install`/`npm install`.

You can also add these packages to your `package.json` on the command line:

```
yarn add @appsignal/webpack
npm install --save @appsignal/webpack
```

## Usage

### `AppsignalPlugin`

In a new or existing Webpack-based app, your `webpack.config.js` file would include something like this:

```js
const { AppsignalPlugin } = require("@appsignal/webpack")

const config = {
  // ...other config here
  plugins: [
    // ...other plugins here (optional)
    new AppsignalPlugin({
      key: "<your frontend API key>",
      release: "<a valid Git SHA>",
      appName: "<the app name as it appears on AppSignal.com>",
      environment: "<the current environment>"
    })
  ],
  devtool: "source-map"
}

module.exports = config
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
