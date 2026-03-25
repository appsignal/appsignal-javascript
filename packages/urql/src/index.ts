import { pipe, tap } from 'wonka';
import type Appsignal from '@appsignal/javascript';

/**
 * Custom urql exchange that automatically reports GraphQL errors to AppSignal.
 *
 * This exchange intercepts all query/mutation results and reports any errors
 * to AppSignal without requiring changes to individual useQuery calls.
 *
 * @example
 * ```typescript
 * import { createClient, fetchExchange } from 'urql';
 * import Appsignal from '@appsignal/javascript';
 * import { createAppsignalExchange } from '@appsignal/urql';
 *
 * const appsignal = new Appsignal({
 *   key: 'YOUR FRONTEND API KEY'
 * });
 *
 * const client = createClient({
 *   url: 'https://api.example.com/graphql',
 *   exchanges: [createAppsignalExchange(appsignal), fetchExchange]
 * });
 * ```
 */
export const createAppsignalExchange = (appsignal: Appsignal) => ({ forward, client }: any) => (ops$: any) => {
  return pipe(
    forward(ops$),
    tap((result: any) => {
      if (result.error) {
        const { error, operation } = result;

        // Convert CombinedError to a proper Error with meaningful message
        const errorMessage = error.graphQLErrors?.length > 0
          ? error.graphQLErrors.map((e: any) => e.message).join(', ')
          : error.message;

        const reportError = new Error(`GraphQL Error: ${errorMessage}`);
        reportError.name = 'GraphQLError';
        (reportError as any).stack = error.stack || reportError.stack;

        // Send error to AppSignal with metadata
        appsignal.sendError(reportError, (span) => {
          // Add endpoint URL as a tag
          if (client?.url) {
            span.setTags({ endpoint: client.url });
          }

          // Add GraphQL query body as a param
          if (operation?.query) {
            const queryBody = operation.query.loc?.source?.body;
            if (queryBody) {
              span.setParams({ query: queryBody });
            }
          }

          // Add operation metadata
          if (operation?.operationName) {
            span.setTags({ operationName: operation.operationName });
          }
          if (operation?.kind) {
            span.setTags({ operationType: operation.kind });
          }
        });
      }
    })
  );
};
