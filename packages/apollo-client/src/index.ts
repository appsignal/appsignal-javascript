import { ErrorHandler, ErrorResponse } from "apollo-link-error"

export function installErrorHandler(appsignal: any): ErrorHandler {
  return function(error: ErrorResponse) {
    const { graphQLErrors, networkError, operation } = error

    const span = appsignal.createSpan()

    span
      .setAction(operation.operationName)
      .setParams(operation.variables)
      .setTags({ framework: "Apollo Client" })

    if (graphQLErrors) {
      // @TODO: handle graphql errors?
      return
    }

    if (networkError) {
      span.setError(networkError)
    }

    appsignal.send(span)
  }
}
