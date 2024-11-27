import { Span } from "../span"

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
      span.cleanBacktracePath(new RegExp("/assets/(app/.*)$"))

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
      span.cleanBacktracePath(new RegExp("/assets/(app/.*)$"))

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
        new RegExp(".*/(assets/)(?:[0-9a-f]{16}/)?(app/.*)$")
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
      span.cleanBacktracePath([
        // This can only match `Bar`.
        new RegExp("/assets/[0-9a-f]{16}/(.*)$"),

        // This can match both `Foo` and `Bar`, but should only
        // match `Foo` because the previous matcher takes precedence.
        new RegExp("/assets/(.*)$")
      ])

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
      span.cleanBacktracePath(new RegExp(".*"))

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
      span.cleanBacktracePath(new RegExp(".*(z*)$"))

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
      span.cleanBacktracePath(new RegExp("^pancakes/(.*)$"))

      const backtrace = span.serialize().error.backtrace
      expect(backtrace).toEqual([
        "Foo@http://localhost:8080/assets/app/bundle.js:13:10"
      ])

      expect(span.serialize().environment).toBeUndefined()
    })
  })
})
