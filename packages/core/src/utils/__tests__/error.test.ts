import { isError } from "../error"

describe("isError", () => {
  it("with Error returns true", () => {
    expect(isError(new Error())).toBe(true)
  })

  it("with Event returns false", () => {
    expect(isError(new Event("message") as any)).toBe(false)
  })

  it("with object returns false", () => {
    expect(isError({} as any)).toBe(false)
  })
})
