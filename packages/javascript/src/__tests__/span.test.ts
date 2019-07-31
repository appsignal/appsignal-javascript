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
      expect(span.serialize().error.message).toBe("")
    })
  })
})
