import { pipe, tap } from "wonka"
import type Appsignal from "@appsignal/javascript"

type ErrorReporter = {
  sendError: (error: Error, callback: (span: any) => void) => void
}

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
export const createAppsignalExchange = (appsignal: Appsignal) => ({
  forward,
  client
}: any) => (ops$: any) => {
  return pipe(
    forward(ops$),
    tap((result: any) => {
      if (result.error) {
        reportGraphQLError(result, appsignal, client)
      }
    })
  )
}

export function reportGraphQLError(
  result: any,
  appsignal: ErrorReporter,
  client: any
) {
  const { error, operation } = result

  const errorMessage =
    error.graphQLErrors?.length > 0
      ? error.graphQLErrors.map((e: any) => e.message).join(", ")
      : error.message

  const reportError = new Error(`GraphQL Error: ${errorMessage}`)
  reportError.name = "GraphQLError"
  ;(reportError as any).stack = error.stack || reportError.stack

  appsignal.sendError(reportError, span => {
    if (client?.url) {
      span.setTags({ endpoint: client.url })
    }

    if (operation?.query) {
      const queryBody = operation.query.loc?.source?.body
      if (queryBody) {
        span.setParams({ query: queryBody })
      }
    }

    if (operation?.operationName) {
      span.setTags({ operationName: operation.operationName })
    }

    if (operation?.kind) {
      span.setTags({ operationType: operation.kind })
    }
  })
}
