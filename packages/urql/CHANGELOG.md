
## 1.0.0

_Published on 2026-04-21._

### Added

- Our new `@appsignal/urql` package allows reporting all GraphQL errors automatically through a custom `urql` exchange:

  ```javascript
  import { createClient, fetchExchange } from 'urql';
  import Appsignal from '@appsignal/javascript';
  import { createAppsignalExchange } from '@appsignal/urql';

  const appsignal = new Appsignal({
    key: 'YOUR FRONTEND API KEY'
  });

  const client = createClient({
    url: 'https://api.example.com/graphql',
    exchanges: [createAppsignalExchange(appsignal), fetchExchange]
  });
  ```

  (major [c0fc547](https://github.com/appsignal/appsignal-javascript/commit/c0fc5478521982af81adf7124595d328cab4988d))


