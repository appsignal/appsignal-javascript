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
      expect(span.serialize().error.message).toBe(msg)
    })

    it("returns the span when no error is given", () => {
      span.setError((undefined as unknown) as Error)
      expect(span.serialize().error.message).toBe("No error has been set")
    })

    describe("bad input", () => {
      it("handles strings", () => {
        span.setError(("a string" as unknown) as Error)
        expect(span.serialize().error.message).toBe(
          `setError received "a string", which did not provide an error message, or was not an object with a valid message property`
        )
      })

      it("handles numbers", () => {
        span.setError((123 as unknown) as Error)
        expect(span.serialize().error.message).toBe(
          `setError received "123", which did not provide an error message, or was not an object with a valid message property`
        )
      })

      it("handles booleans", () => {
        span.setError((true as unknown) as Error)
        expect(span.serialize().error.message).toBe(
          `setError received "true", which did not provide an error message, or was not an object with a valid message property`
        )
      })

      it("handles arrays", () => {
        span.setError(([] as unknown) as Error)
        expect(span.serialize().error.message).toBe(
          `setError received "[]", which did not provide an error message, or was not an object with a valid message property`
        )
      })

      it("handles objects", () => {
        span.setError(({} as unknown) as Error)
        expect(span.serialize().error.message).toBe(
          `setError received "{}", which did not provide an error message, or was not an object with a valid message property`
        )
      })
    })
  })
})
