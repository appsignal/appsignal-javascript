import { reportGraphQLError } from "../index"

describe("reportGraphQLError", () => {
  it("reports a GraphQL error to AppSignal with all metadata", () => {
    const { appsignal, span } = createMockAppsignal()
    const client = { url: "https://example.com/graphql" }
    const result = {
      error: {
        graphQLErrors: [{ message: "Not found" }]
      },
      operation: {
        query: { loc: { source: { body: "query { post { id } }" } } },
        operationName: "GetPost",
        kind: "query"
      }
    }

    reportGraphQLError(result, appsignal, client)

    expect(appsignal.sendError).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "GraphQLError",
        message: "GraphQL Error: Not found"
      }),
      expect.any(Function)
    )
    expect(span.setTags).toHaveBeenCalledWith({
      endpoint: "https://example.com/graphql"
    })
    expect(span.setTags).toHaveBeenCalledWith({ operationName: "GetPost" })
    expect(span.setTags).toHaveBeenCalledWith({ operationType: "query" })
    expect(span.setParams).toHaveBeenCalledWith({
      query: "query { post { id } }"
    })
  })

  it("sets endpoint tag", () => {
    const { appsignal, span } = createMockAppsignal()
    const result = {
      error: { message: "Something went wrong" },
      operation: {
        query: { loc: { source: { body: "mutation { createUser { id } }" } } }
      }
    }

    const client = { url: "https://example.com/graphql" }
    reportGraphQLError(result, appsignal, client)

    expect(span.setTags).toHaveBeenCalledWith({
      endpoint: "https://example.com/graphql"
    })
  })

  it("sets query params on the span", () => {
    const { appsignal, span } = createMockAppsignal()
    const result = {
      error: { message: "Something went wrong" },
      operation: {
        query: { loc: { source: { body: "mutation { createPost { id } }" } } }
      }
    }

    reportGraphQLError(result, appsignal, {})

    expect(span.setParams).toHaveBeenCalledWith({
      query: "mutation { createPost { id } }"
    })
  })

  it("sets operationName tag on the span", () => {
    const { appsignal, span } = createMockAppsignal()
    const result = {
      error: { message: "Something went wrong" },
      operation: { operationName: "CreatePost" }
    }

    reportGraphQLError(result, appsignal, {})

    expect(span.setTags).toHaveBeenCalledWith({
      operationName: "CreatePost"
    })
  })

  it("sets operationType tag on the span", () => {
    const { appsignal, span } = createMockAppsignal()
    const result = {
      error: { message: "Something went wrong" },
      operation: { kind: "mutation" }
    }

    reportGraphQLError(result, appsignal, {})

    expect(span.setTags).toHaveBeenCalledWith({
      operationType: "mutation"
    })
  })
})

function createMockAppsignal() {
  const span = {
    setTags: jest.fn(),
    setParams: jest.fn()
  }
  const appsignal = {
    sendError: jest.fn((_error: any, callback: any) => callback(span))
  }
  return { appsignal, span }
}
