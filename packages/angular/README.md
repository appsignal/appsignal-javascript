# `@appsignal/angular`

- [AppSignal.com website][appsignal]
- [Documentation][docs]
- [Support][contact]

The `@appsignal/javascript` integration for Angular v8+. The integration may work on lower versions of Angular, but it has not been tested with them. 

See also the [mono repo README](../../README.md) for more information.

## Installation

Add the `@appsignal/angular` and `@appsignal/javascript` packages to your `package.json`. Then, run `npm install`/`yarn install`/`pnpm install`.

You can also add these packages to your `package.json` on the command line:

```bash
npm install @appsignal/javascript @appsignal/angular
# Or if you use yarn
yarn add @appsignal/javascript @appsignal/angular
# Or if you use pnpm
pnpm install @appsignal/javascript @appsignal/angular
```

## Usage

### `AppsignalErrorHandler`

The default Angular integration is a class that extends the `ErrorHandler` class provided by `@angular/core`. In a new app created using `@angular/cli`, your `app.config.ts` file might include something like this:

```ts
// app.config.ts
import { type ApplicationConfig, ErrorHandler } from '@angular/core';
import AppSignal from '@appsignal/javascript';
import { createErrorHandlerFactory } from '@appsignal/angular';

const appSignalFactory = () =>
  new AppSignal({
    key: 'YOUR FRONTEND API KEY',
  });

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: ErrorHandler,
      useFactory: createErrorHandlerFactory(appSignalFactory),
    },
  ],
};
```

This accepts a factory because you **lazy-load** `@appsignal/javascript` only when the first error is logged:

```ts
// app.config.ts
import { type ApplicationConfig, ErrorHandler } from '@angular/core';
import { createErrorHandlerFactory } from '@appsignal/angular';

const appSignalFactory = () =>
  import('@appsignal/javascript').then((m) => {
    const AppSignal = m.default;
    return new AppSignal({
      key: 'YOUR FRONTEND API KEY',
    });
  });

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: ErrorHandler,
      useFactory: createErrorHandlerFactory(appSignalFactory),
    },
  ],
};
```

## Development

### Installation

Make sure mono is installed and bootstrapped, see the [project README's development section](../../README.md#dev-install) for more information.

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
