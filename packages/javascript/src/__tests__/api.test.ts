import { PushApi } from "../api"
import { Event } from "../event"

describe("PushApi", () => {
  const FIXTURE = new Event({
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
    api = new PushApi({ key: "TESTKEY", version: "1.0.0" })
  })

  describe("push", () => {
    it("pushes a transaction to the Push API", async () => {
      const uri =
        "https://appsignal-error-monitoring.net/collect?api_key=TESTKEY&version=1.0.0"

      await api.push(FIXTURE)

      expect(fetchMock).toBeCalledWith(uri, {
        method: "POST",
        body: FIXTURE.toJSON()
      })
    })
  })
})
