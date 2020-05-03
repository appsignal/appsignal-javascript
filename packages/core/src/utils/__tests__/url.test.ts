import { urlEncode } from "../url"

describe("urlEncode", () => {
  it("encodes a url string", () => {
    const url = urlEncode({ string: "abc", number: 123, boolean: true })
    expect(url).toEqual("string=abc&number=123&boolean=true")
  })
})
