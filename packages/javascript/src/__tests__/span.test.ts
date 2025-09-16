import { Span, toBacktraceMatcher } from "../span"

describe("Span", () => {
  let span: Span

  beforeEach(() => {
    /* Runs before each test */
    span = new Span()
  })

  describe("setError", () => {
    it("updates the spans error", () => {
      const msg = "test error"
      span.setError(new Error(msg))
      expect(span.serialize().error.message).toEqual(msg)
    })

    it("returns the span when no error is given", () => {
      const result = span.setError((undefined as unknown) as Error)
      expect(span.serialize().error.message).toEqual("No error has been set")
      expect(result).toBe(span)
    })

    it("returns the span when the passed object is not an error", () => {
      const event = new CloseEvent("event")
      const result = span.setError((event as unknown) as Error)
      expect(span.serialize().error.message).toEqual("No error has been set")
      expect(result).toBe(span)
    })
  })

  describe("setEnvironment", () => {
    it("updates the spans environment", () => {
      span.setEnvironment({ key: "value" })
      expect(span.serialize().environment).toEqual({ key: "value" })
    })

    it("merges the environment", () => {
      span.setEnvironment({ key: "value" })
      span.setEnvironment({ key2: "value2" })
      expect(span.serialize().environment).toEqual({
        key: "value",
        key2: "value2"
      })
    })

    it("returns the span when no environment is given", () => {
      const result = span.setEnvironment(
        (undefined as unknown) as { key: string }
      )
      expect(span.serialize().environment).toEqual({})
      expect(result).toBe(span)
    })

    it("returns the span when the passed object is not an object", () => {
      const result = span.setEnvironment((123 as unknown) as { key: string })
      expect(span.serialize().environment).toEqual({})
      expect(result).toBe(span)
    })
  })

  describe("cleanBacktracePath", () => {
    it("cleans Chrome-style backtraces", () => {
      const error = new Error("test error")
      error.stack = [
        "Error: test error",
        "    at Foo (http://localhost:8080/assets/app/bundle.js:13:10)",
        "    at Bar (http://localhost:8080/assets/app/bundle.js:17:10)",
        "    at track (http://thirdparty.app/script.js:1:530)",
        "    at http://localhost:8080/assets/app/bundle.js:21:10"
      ].join("\n")

      span.setError(error)
      span.cleanBacktracePath(
        [new RegExp("/assets/(app/.*)$")].map(toBacktraceMatcher)
      )

      const backtrace = span.serialize().error.backtrace
      expect(backtrace).toEqual([
        "Error: test error",
        "    at Foo (app/bundle.js:13:10)",
        "    at Bar (app/bundle.js:17:10)",
        "    at track (http://thirdparty.app/script.js:1:530)",
        "    at app/bundle.js:21:10"
      ])

      expect(span.serialize().environment).toMatchObject({
        backtrace_paths_matched: "3"
      })
    })

    it("cleans Safari/FF-style backtraces", () => {
      const error = new Error("test error")
      error.stack = [
        "Foo@http://localhost:8080/assets/app/bundle.js:13:10",
        "Bar@http://localhost:8080/assets/app/bundle.js:17:10",
        "track@http://thirdparty.app/script.js:1:530",
        "@http://localhost:8080/assets/app/bundle.js:21:10"
      ].join("\n")

      span.setError(error)
      span.cleanBacktracePath(
        [new RegExp("/assets/(app/.*)$")].map(toBacktraceMatcher)
      )

      const backtrace = span.serialize().error.backtrace
      expect(backtrace).toEqual([
        "Foo@app/bundle.js:13:10",
        "Bar@app/bundle.js:17:10",
        "track@http://thirdparty.app/script.js:1:530",
        "@app/bundle.js:21:10"
      ])

      expect(span.serialize().environment).toMatchObject({
        backtrace_paths_matched: "3"
      })
    })

    it("concatenates all match groups", () => {
      const error = new Error("test error")
      error.stack = [
        "Error: test error",
        "    at Foo (http://localhost:8080/assets/app/bundle.js:13:10)",
        "    at Bar (http://cdn.coolbeans.app/assets/9ac54f82103a399d/app/bundle.js:17:10)",
        "    at track (http://thirdparty.app/script.js:1:530)",
        "    at http://cdn.coolbeans.app/assets/9ac54f82103a399d/app/bundle.js:21:10"
      ].join("\n")

      span.setError(error)
      span.cleanBacktracePath(
        [new RegExp(".*/(assets/)(?:[0-9a-f]{16}/)?(app/.*)$")].map(
          toBacktraceMatcher
        )
      )

      const backtrace = span.serialize().error.backtrace
      expect(backtrace).toEqual([
        "Error: test error",
        "    at Foo (assets/app/bundle.js:13:10)",
        "    at Bar (assets/app/bundle.js:17:10)",
        "    at track (http://thirdparty.app/script.js:1:530)",
        "    at assets/app/bundle.js:21:10"
      ])

      expect(span.serialize().environment).toMatchObject({
        backtrace_paths_matched: "3"
      })
    })

    it("tries matchers in order", () => {
      const error = new Error("test error")
      error.stack = [
        "Foo@http://localhost:8080/assets/app/bundle.js:13:10",
        "Bar@http://cdn.coolbeans.app/assets/9ac54f82103a399d/app/bundle.js:17:10"
      ].join("\n")

      span.setError(error)
      span.cleanBacktracePath(
        [
          // This can only match `Bar`.
          new RegExp("/assets/[0-9a-f]{16}/(.*)$"),

          // This can match both `Foo` and `Bar`, but should only
          // match `Foo` because the previous matcher takes precedence.
          new RegExp("/assets/(.*)$")
        ].map(toBacktraceMatcher)
      )

      const backtrace = span.serialize().error.backtrace
      expect(backtrace).toEqual([
        "Foo@app/bundle.js:13:10",
        "Bar@app/bundle.js:17:10"
      ])

      expect(span.serialize().environment).toMatchObject({
        backtrace_paths_matched: "2"
      })
    })

    it("does not match any paths when the matcher has no match groups", () => {
      const error = new Error("test error")
      error.stack = [
        "Foo@http://localhost:8080/assets/app/bundle.js:13:10"
      ].join("\n")

      span.setError(error)
      // This regex always matches the line, but contains no match groups,
      // meaning the replacement that the matcher would do would be to an
      // empty string.
      //
      // This should result in the line not being modified.
      span.cleanBacktracePath([new RegExp(".*")].map(toBacktraceMatcher))

      const backtrace = span.serialize().error.backtrace
      expect(backtrace).toEqual([
        "Foo@http://localhost:8080/assets/app/bundle.js:13:10"
      ])

      expect(span.serialize().environment).toBeUndefined()
    })

    it("does not replace the path when the match is empty", () => {
      const error = new Error("test error")
      error.stack = [
        "Foo@http://localhost:8080/assets/app/bundle.js:13:10"
      ].join("\n")

      span.setError(error)
      // This regex always matches the line with an empty match group,
      // meaning the replacement that the matcher would do would be to an
      // empty string.
      //
      // This should result in the line not being modified.
      span.cleanBacktracePath([new RegExp(".*(z*)$")].map(toBacktraceMatcher))

      const backtrace = span.serialize().error.backtrace
      expect(backtrace).toEqual([
        "Foo@http://localhost:8080/assets/app/bundle.js:13:10"
      ])

      expect(span.serialize().environment).toBeUndefined()
    })

    it("does not report `backtrace_paths_matched` when no paths are matched", () => {
      const error = new Error("test error")
      error.stack = [
        "Foo@http://localhost:8080/assets/app/bundle.js:13:10"
      ].join("\n")

      span.setError(error)
      span.cleanBacktracePath(
        [new RegExp("^pancakes/(.*)$")].map(toBacktraceMatcher)
      )

      const backtrace = span.serialize().error.backtrace
      expect(backtrace).toEqual([
        "Foo@http://localhost:8080/assets/app/bundle.js:13:10"
      ])

      expect(span.serialize().environment).toBeUndefined()
    })

    it("can be used with custom backtrace matcher functions", () => {
      const error = new Error("test error")
      error.stack = [
        "Foo@http://localhost:8080/assets/app/first.js:13:10",
        "Bar@http://localhost:8080/assets/app/second.js:13:10",
        "Baz@http://localhost:8080/assets/app/third.js:13:10"
      ].join("\n")

      span.setError(error)
      span.cleanBacktracePath([
        path => (path.indexOf("first") !== -1 ? "foo.js" : undefined),
        path => (path.indexOf("second") !== -1 ? "bar.js" : undefined)
      ])

      const backtrace = span.serialize().error.backtrace
      expect(backtrace).toEqual([
        "Foo@foo.js:13:10",
        "Bar@bar.js:13:10",
        "Baz@http://localhost:8080/assets/app/third.js:13:10"
      ])

      expect(span.serialize().environment).toMatchObject({
        backtrace_paths_matched: "2"
      })
    })
  })

  describe("getAction", () => {
    it("returns undefined when no action is set", () => {
      expect(span.getAction()).toBeUndefined()
    })

    it("returns the action when set", () => {
      span.setAction("test-action")
      expect(span.getAction()).toBe("test-action")
    })
  })

  describe("getNamespace", () => {
    it("returns the default namespace", () => {
      expect(span.getNamespace()).toBe("frontend")
    })

    it("returns the namespace when set", () => {
      span.setNamespace("backend")
      expect(span.getNamespace()).toBe("backend")
    })
  })

  describe("getError", () => {
    it("returns the default error", () => {
      const error = span.getError()
      expect(error).toEqual({
        name: "NullError",
        message: "No error has been set",
        backtrace: []
      })
    })

    it("returns the error when set", () => {
      const testError = new Error("test error")
      span.setError(testError)
      const error = span.getError()
      expect(error?.name).toBe("Error")
      expect(error?.message).toBe("test error")
      expect(error?.backtrace).toBeDefined()
    })
  })

  describe("getTags", () => {
    it("returns empty object when no tags are set", () => {
      expect(span.getTags()).toEqual({})
    })

    it("returns the tags when set", () => {
      span.setTags({ key: "value", another: "tag" })
      expect(span.getTags()).toEqual({ key: "value", another: "tag" })
    })
  })

  describe("getParams", () => {
    it("returns empty object when no params are set", () => {
      expect(span.getParams()).toEqual({})
    })

    it("returns the params when set", () => {
      span.setParams({ key: "value", number: 42 })
      expect(span.getParams()).toEqual({ key: "value", number: 42 })
    })
  })

  describe("getBreadcrumbs", () => {
    it("returns empty array when no breadcrumbs are set", () => {
      expect(span.getBreadcrumbs()).toEqual([])
    })

    it("returns the breadcrumbs when set", () => {
      const breadcrumbs = [
        { timestamp: 123456, category: "log", action: "info", message: "test" },
        {
          timestamp: 123457,
          category: "navigation",
          action: "click",
          message: "page load"
        }
      ]
      span.setBreadcrumbs(breadcrumbs)
      expect(span.getBreadcrumbs()).toEqual(breadcrumbs)
    })
  })

  describe("getEnvironment", () => {
    it("returns empty object when no environment is set", () => {
      expect(span.getEnvironment()).toEqual({})
    })

    it("returns the environment when set", () => {
      span.setEnvironment({ key: "value", env: "test" })
      expect(span.getEnvironment()).toEqual({ key: "value", env: "test" })
    })
  })
})
