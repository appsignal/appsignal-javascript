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
      span.setError((undefined as unknown) as Error)
      expect(span.serialize().error.message).toEqual("No error has been set")
    })

    it("returns the span when the passed object is not an error", () => {
      const event = new CloseEvent("event")
      span.setError((event as unknown) as Error)
      expect(span.serialize().error.message).toEqual("No error has been set")
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
    })
  })
})
