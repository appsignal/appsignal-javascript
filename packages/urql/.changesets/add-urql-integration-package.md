---
bump: major
type: add
---

Our new `@appsignal/urql` package allows reporting all GraphQL errors automatically through a custom `urql` exchange:

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
