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
      expect(hm).toStrictEqual({
        string: "abc",
        number: 123,
        boolean: true,
        object: '{"test":123}'
      })
    } else {
      expect(hm).not.toBeUndefined()
    }
  })

  it("does not modify the given object", () => {
    const obj = {
      string: "abc",
      number: 123,
      boolean: true,
      object: { test: 123 }
    }

    const hm = toHashMap(obj)

    expect(obj).toStrictEqual({
      string: "abc",
      number: 123,
      boolean: true,
      object: { test: 123 }
    })

    // the object it returns should be a different object
    expect(hm).not.toBe(obj)
  })

  it("returns undefined if argument is undefined", () => {
    const hm = toHashMap()
    expect(hm).toBeUndefined()
  })
})

describe("toHashMapString", () => {
  it("converts all values in a flat object to a string", () => {
    const hm = toHashMapString({
      string: "abc",
      number: 123,
      boolean: true,
      object: { test: 123 }
    })

    if (hm) {
      expect(hm).toStrictEqual({
        string: "abc",
        number: "123",
        boolean: "true",
        object: '{"test":123}'
      })
    } else {
      expect(hm).not.toBeUndefined()
    }
  })

  it("does not modify the given object", () => {
    const obj = {
      string: "abc",
      number: 123,
      boolean: true,
      object: { test: 123 }
    }

    const hm = toHashMapString(obj)

    expect(obj).toStrictEqual({
      string: "abc",
      number: 123,
      boolean: true,
      object: { test: 123 }
    })

    // the object it returns should be a different object
    expect(hm).not.toBe(obj)
  })

  it("returns undefined if argument is undefined", () => {
    const hm = toHashMapString()
    expect(hm).toBeUndefined()
  })
})
