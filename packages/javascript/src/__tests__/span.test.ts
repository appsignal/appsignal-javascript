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

    describe("bad input", () => {
      it("handles strings", () => {
        span.setError(("a string" as unknown) as Error)
        expect(span.serialize().error.message).toEqual(
          "setError received an invalid object or type which did not provide an error message or was not an object with a valid message property.\n\nHere's some more information about what we received:\n\n" +
            `typeof: string\n` +
            `constructor.name: String\n` +
            `As a string: "a string"`
        )
      })

      it("handles numbers", () => {
        span.setError((123 as unknown) as Error)
        expect(span.serialize().error.message).toEqual(
          "setError received an invalid object or type which did not provide an error message or was not an object with a valid message property.\n\nHere's some more information about what we received:\n\n" +
            `typeof: number\n` +
            `constructor.name: Number\n` +
            `As a string: "123"`
        )
      })

      it("handles booleans", () => {
        span.setError((true as unknown) as Error)
        expect(span.serialize().error.message).toEqual(
          "setError received an invalid object or type which did not provide an error message or was not an object with a valid message property.\n\nHere's some more information about what we received:\n\n" +
            `typeof: boolean\n` +
            `constructor.name: Boolean\n` +
            `As a string: "true"`
        )
      })

      it("handles arrays", () => {
        span.setError(([] as unknown) as Error)
        expect(span.serialize().error.message).toEqual(
          "setError received an invalid object or type which did not provide an error message or was not an object with a valid message property.\n\nHere's some more information about what we received:\n\n" +
            `typeof: object\n` +
            `constructor.name: Array\n` +
            `As a string: "[]"`
        )
      })

      it("handles objects", () => {
        span.setError(({} as unknown) as Error)
        expect(span.serialize().error.message).toEqual(
          "setError received an invalid object or type which did not provide an error message or was not an object with a valid message property.\n\nHere's some more information about what we received:\n\n" +
            `typeof: object\n` +
            `constructor.name: Object\n` +
            `As a string: "{}"`
        )
      })
    })
  })
})
