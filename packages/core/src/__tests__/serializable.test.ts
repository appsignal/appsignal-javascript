import { Serializable } from "../serializable"

describe("Serializable", () => {
  let sz: Serializable

  describe("with array", () => {
    const fixture = ["test"]

    beforeEach(() => {
      sz = new Serializable(fixture)
    })

    it("should serialize to JSON", () => {
      expect(sz.toJSON()).toEqual(JSON.stringify(fixture))
    })

    it("should serialize to an object", () => {
      expect(sz.serialize()).toBe(fixture)
    })
  })

  describe("with object", () => {
    const fixture = { test: "test" }

    beforeEach(() => {
      sz = new Serializable(fixture)
    })

    it("should serialize to JSON", () => {
      expect(sz.toJSON()).toEqual(JSON.stringify(fixture))
    })

    it("should serialize to an object", () => {
      expect(sz.serialize()).toBe(fixture)
    })
  })
})
