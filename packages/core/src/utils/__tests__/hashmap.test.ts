import { toHashMap, toHashMapString } from "../hashmap"

describe("toHashMap", () => {
  it("converts any non-string, boolean or number value in an object to a string", () => {
    const hm = toHashMap({
      string: "abc",
      number: 123,
      boolean: true,
      object: { test: 123 }
    })

    if (hm) {
      Object.values(hm).forEach(el =>
        expect(
          typeof el === "string" ||
            typeof el === "number" ||
            typeof el === "boolean"
        ).toBeTruthy()
      )
    }
  })

  it("returns undefined if argument is undefined", () => {
    const hm = toHashMapString()
    expect(hm).toBeUndefined()
  })
})

describe("toHashMapString", () => {
  it("converts all values in a flat object to a string", () => {
    const hm = toHashMapString({ string: "abc", number: 123, boolean: true })

    if (hm) {
      Object.values(hm).forEach((el: string) =>
        expect(typeof el === "string").toBeTruthy()
      )
    }
  })

  it("returns undefined if argument is undefined", () => {
    const hm = toHashMapString()
    expect(hm).toBeUndefined()
  })
})
