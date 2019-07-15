import { VERSION } from "../version"

import { PushApi } from "../api"
import { Span } from "../span"

describe("PushApi", () => {
  const FIXTURE = new Span({
    timestamp: 111111,
    namespace: "frontend",
    environment: {},
    error: { name: "TestError" }
  })

  let api: PushApi

  let fetchMock = jest.fn().mockImplementation(() =>
    Promise.resolve({
      ok: true
    })
  )

  beforeAll(() => (window.fetch = fetchMock))

  beforeEach(() => {
    /* Runs before each test */
    api = new PushApi({ key: "TESTKEY", version: VERSION })
  })

  describe("push", () => {
    it("pushes a transaction to the Push API", async () => {
      const uri = `https://appsignal-endpoint.net/collect?api_key=TESTKEY&version=${VERSION}`

      await api.push(FIXTURE)

      expect(fetchMock).toBeCalledWith(uri, {
        method: "POST",
        body: FIXTURE.toJSON()
      })
    })
  })
})
