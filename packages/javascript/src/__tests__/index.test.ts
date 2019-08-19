import { VERSION } from "../version"

import Appsignal from "../index"
import { Span } from "../span"
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
    it("pushes an error", () => {
      const message = "test error"
      const promise = appsignal.sendError(new Error(message))

      expect(promise).resolves
    })

    it("doesn't send an invalid error", () => {
      expect(() => {
        // we have to do some weird looking type casting here so the
        // compiler doesn't fail and actually allows us to test
        const promise = appsignal.sendError(("Test error" as unknown) as Error)
      }).toThrow()
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

  describe("createSpan", () => {
    it("creates a new span given no params", () => {
      const span = appsignal.createSpan()
      const result = span.serialize()

      expect(result).toHaveProperty("timestamp")
      expect(typeof result.timestamp).toBe("number")
    })

    it("modifies a span when created with a function as a parameter", () => {
      const span = appsignal.createSpan((span: Span) =>
        span.setAction("test action").setError(new Error("test error"))
      )

      const result = span.serialize()

      expect(result.action).toEqual("test action")
      expect(result.error.message).toEqual("test error")
    })
  })

  describe("addDecorator", () => {
    it("adds decorators", async () => {
      const testTag = { tag: "test" }
      const testAction = "test action"

      appsignal.addDecorator(span => span.setAction(testAction))

      // assert that we always able to return a span from sendError
      const firstSpan = (await appsignal.sendError(new Error())) as Span
      expect(firstSpan.serialize().action).toBe(testAction)

      appsignal.addDecorator(span => span.setTags(testTag))

      // assert that we always able to return a span from sendError
      const secondSpan = (await appsignal.sendError(new Error())) as Span
      expect(secondSpan.serialize().action).toBe(testAction)
      expect(secondSpan.serialize().tags).toStrictEqual(testTag)
    })
  })

  describe("addOverride", () => {
    it("adds overrides", async () => {
      const testTag = { tag: "test" }
      const testAction = "test action"

      appsignal.addOverride(span => span.setAction(testAction))

      // assert that we always able to return a span from sendError
      const firstSpan = (await appsignal.sendError(new Error())) as Span
      expect(firstSpan.serialize().action).toBe(testAction)

      appsignal.addOverride(span => span.setTags(testTag))

      // assert that we always able to return a span from sendError
      const secondSpan = (await appsignal.sendError(new Error())) as Span
      expect(secondSpan.serialize().action).toBe(testAction)
      expect(secondSpan.serialize().tags).toStrictEqual(testTag)
    })
  })
})
