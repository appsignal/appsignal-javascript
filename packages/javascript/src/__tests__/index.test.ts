import { VERSION } from "../version"

import Appsignal from "../index"
import { PushApi } from "../api"

jest.mock("../api")

describe("Appsignal", () => {
  let appsignal: Appsignal

  beforeEach(() => {
    /* Runs before each test */
    appsignal = new Appsignal({ key: "TESTKEY" })
  })

  it("exposes a valid version number", () => {
    expect(appsignal.VERSION).toEqual(VERSION)
  })

  describe("sendError", () => {
    it("pushes an error to the API", () => {
      const message = "test error"
      const promise = appsignal.sendError(new Error(message))

      expect(promise).resolves
    })
  })

  describe("wrap", () => {
    it("returns a value if sync function doesn't throw", async () => {
      const value = await appsignal.wrap(() => {
        return 42
      })

      expect(value).toEqual(42)
    })

    it("returns a no value if nothing is returned and function doesn't throw", async () => {
      const value = await appsignal.wrap(() => {
        Math.floor(1.3)
      })

      expect(value).toEqual(undefined)
    })

    it("reports an error if sync function throws", async () => {
      try {
        await appsignal.wrap(() => {
          throw new Error("test error")
        })
      } catch (e) {
        expect(e.message).toEqual("test error")
      }
    })

    it("returns a value if async function doesn't throw", async () => {
      const value = await appsignal.wrap(() => {
        return Promise.resolve(42)
      })

      expect(value).toEqual(42)
    })

    it("reports an error if async function throws", async () => {
      try {
        await appsignal.wrap(async () => {
          throw new Error("test error")
        })
      } catch (e) {
        expect(e.message).toEqual("test error")
      }
    })

    it("returns a value if sync function doesn't throw (promises)", () => {
      const promise = appsignal.wrap(() => {
        return 42
      })

      expect(promise).resolves.toEqual(42)
    })

    it("returns a no value if nothing is returned and function doesn't throw (promises)", () => {
      const promise = appsignal.wrap(() => {
        Math.floor(1.3)
      })

      expect(promise).resolves.toEqual(undefined)
    })

    it("reports an error if sync function throws (promises)", async () => {
      const promise = appsignal
        .wrap(() => {
          throw new Error("test error")
        })
        .catch(e => expect(e.message).toEqual("test error"))

      expect(promise).rejects
    })
  })
})
