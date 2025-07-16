import { VERSION } from "../version"

import Appsignal from "../index"
import { Span } from "../span"
import { Override } from "../hook"

import * as api from "../api"

// @ts-ignore
const pushMockCall: (index?: number) => any = api.pushMockCall

jest.mock("../api")

/* Since Node.js does not have an implementation of the browser's
 * `ErrorEvent`, implement a fake ErrorEvent class with the same
 * interface.
 */
class FakeErrorEvent {
  error: Error | undefined

  constructor(error?: Error) {
    this.error = error
  }
}

describe("Appsignal", () => {
  let appsignal: Appsignal

  beforeEach(() => {
    /* Runs before each test */
    appsignal = new Appsignal({ key: "TESTKEY" })
  })

  it("exposes a valid version number", () => {
    expect(appsignal.VERSION).toEqual(VERSION)
  })

  it("receives a namespace if one is passed to the constructor", () => {
    appsignal = new Appsignal({ key: "TESTKEY", namespace: "test" })

    const span = appsignal.createSpan()
    const result = span.serialize()

    expect(result).toHaveProperty("namespace")
    expect(result.namespace).toEqual("test")
  })

  it("receives an array of ignored patterns if one is passed to the constructor", () => {
    const ignored = [/Ignore me/gm]

    appsignal = new Appsignal({
      key: "TESTKEY",
      namespace: "test",
      ignoreErrors: ignored
    })

    // We clean the given regexes to remove the `g` flag, as it causes
    // matches to misbehave by remembering the last matched position:
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test#using_test_on_a_regex_with_the_global_flag
    expect(appsignal.ignored).toEqual([/Ignore me/m])
  })

  describe("send", () => {
    it("ignores an error that matches a regex in the ignored list", () => {
      const name = "Ignore me"
      const ignored = [/Ignore me/gm]

      appsignal = new Appsignal({
        key: "TESTKEY",
        namespace: "test",
        ignoreErrors: ignored
      })

      // monkeypatch console with mock fn
      const original = console.warn
      console.warn = jest.fn()

      appsignal.send(new Error(name))

      expect(console.warn).toBeCalledTimes(1)
      expect(console.warn).toBeCalledWith(
        `[APPSIGNAL]: Ignored an error: ${name}`
      )

      // As the regex used has the `g` flag, it would
      // remember the last matched position and fail to match again:
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test#using_test_on_a_regex_with_the_global_flag
      // We remove the `g` flag to make it match again, so it should match.
      appsignal.send(new Error(name))
      expect(console.warn).toBeCalledTimes(2)

      // reset
      console.warn = original
    })

    it("cleans the backtrace path if `matchBacktracePaths` is set", () => {
      appsignal = new Appsignal({
        key: "TESTKEY",
        namespace: "test",
        matchBacktracePaths: [/here(.*)/g]
      })

      const error = new Error("test error")
      error.stack = [
        "Error: test error",
        "    at Foo (http://localhost:8080/here/istheapp.js:13:10)"
      ].join("\n")

      appsignal.send(error)

      const firstPayload = pushMockCall(0)

      expect(firstPayload.error.backtrace).toEqual([
        "Error: test error",
        "    at Foo (/istheapp.js:13:10)"
      ])

      expect(firstPayload.environment.backtrace_paths_matched).toEqual("1")

      // As the regex used has the `g` flag, it would
      // remember the last matched position and fail to match again:
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test#using_test_on_a_regex_with_the_global_flag
      // We remove the `g` flag to make it match again, so it should match.
      appsignal.send(error)

      const secondPayload = pushMockCall(1)
      expect(secondPayload.environment.backtrace_paths_matched).toEqual("1")
    })
  })

  describe("sendError", () => {
    it("pushes an error", () => {
      const spy = jest.spyOn(console, "error").mockImplementation()

      const message = "test error"
      const promise = appsignal.sendError(new Error(message), span => {
        expect(span.serialize().error.message).toEqual(message)
      })

      expect(promise).resolves
      expect(spy).not.toHaveBeenCalled()
      spy.mockRestore()
    })

    it("modifies the span before pushing the error", async () => {
      const message = "test error"
      let resultSpan: Span | undefined
      const promise = appsignal.sendError(new Error(message), function (span) {
        span.setAction("CustomAction")
        resultSpan = span
      })

      await expect(promise).resolves
      if (resultSpan) {
        expect(resultSpan.serialize()?.action).toBe("CustomAction")
      } else {
        throw new Error("No resultSpan found!")
      }
    })

    it("doesn't send an invalid error", () => {
      const spy = jest.spyOn(console, "error").mockImplementation()

      // we have to do some weird looking type casting here so the
      // compiler doesn't fail and actually allows us to test
      appsignal.sendError(("Test error" as unknown) as Error)

      expect(spy).toHaveBeenCalledWith(
        "[APPSIGNAL]: Can't send error, given error is not a valid type"
      )
      spy.mockRestore()
    })

    describe("when given an ErrorEvent", () => {
      it("does not send an ErrorEvent without an error", () => {
        const spy = jest.spyOn(console, "error").mockImplementation()

        appsignal.sendError(new FakeErrorEvent() as any)

        expect(spy).toHaveBeenCalledWith(
          "[APPSIGNAL]: Can't send error, given error is not a valid type"
        )
        spy.mockRestore()
      })

      it("sends the error within an ErrorEvent", () => {
        const spy = jest.spyOn(console, "error").mockImplementation()

        const promise = appsignal.sendError(
          new FakeErrorEvent(new Error("message")) as any,
          span => expect(span.serialize().error.message).toEqual("message")
        )

        expect(promise).resolves
        expect(spy).not.toHaveBeenCalled()
        spy.mockRestore()
      })
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
        if (e instanceof Error) {
          expect(e.message).toEqual("test error")
        }
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
        if (e instanceof Error) {
          expect(e.message).toEqual("test error")
        }
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

    it("modifies the span before pushing the error", async () => {
      let resultSpan: Span | undefined
      const promise = appsignal
        .wrap(
          () => {
            throw new Error("test error")
          },
          function (span) {
            span.setAction("CustomAction")
            resultSpan = span
          }
        )
        .catch(e => expect(e.message).toEqual("test error"))

      await expect(promise).rejects
      if (resultSpan) {
        expect(resultSpan.serialize()?.action).toBe("CustomAction")
      } else {
        throw new Error("No resultSpan found!")
      }
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

    it("ignores spans when override returns false", async () => {
      const original = console.warn
      console.warn = jest.fn()

      appsignal.addOverride(span => false)

      const result = await appsignal.sendError(new Error("test error"))

      expect(result).toBeUndefined()
      expect(console.warn).toHaveBeenCalledWith(
        "[APPSIGNAL]: Ignored a span due to override."
      )

      console.warn = original
    })

    it("can modify error message to affect ignoreErrors matching", async () => {
      const ignored = [/ignore this/]
      appsignal = new Appsignal({
        key: "TESTKEY",
        ignoreErrors: ignored
      })

      const original = console.warn
      console.warn = jest.fn()

      // First, verify the error would normally be sent
      await appsignal.sendError(new Error("original error"))
      expect(console.warn).not.toHaveBeenCalled()

      // Add override that modifies the error message to match ignoreErrors
      appsignal.addOverride(span => {
        const error = span.getError()
        if (error) {
          span.setError(new Error("ignore this error"))
        }
        return span
      })

      // Now the modified error should be ignored
      const result = await appsignal.sendError(new Error("original error"))
      expect(result).toBeUndefined()
      expect(console.warn).toHaveBeenCalledWith(
        "[APPSIGNAL]: Ignored a span: ignore this error"
      )

      console.warn = original
    })

    it("can modify error message to prevent ignoreErrors matching", async () => {
      const ignored = [/ignore this/]
      appsignal = new Appsignal({
        key: "TESTKEY",
        ignoreErrors: ignored
      })

      const original = console.warn
      console.warn = jest.fn()

      // Add override that modifies the error message to avoid ignoreErrors
      appsignal.addOverride(span => {
        const error = span.getError()
        if (error && error.message && error.message.includes("ignore this")) {
          span.setError(new Error("modified error"))
        }
        return span
      })

      // The error would normally be ignored, but override changes it
      const result = await appsignal.sendError(new Error("ignore this error"))
      expect(result).toBeDefined()
      expect(console.warn).not.toHaveBeenCalledWith(
        expect.stringContaining("Ignored a span:")
      )

      console.warn = original
    })

    it("uses returned span from override instead of original", async () => {
      const originalAction = "original action"
      const overrideAction = "override action"
      const originalTags = { original: "tag" }
      const overrideTags = { override: "tag" }

      // Add override that creates and returns a completely new span
      appsignal.addOverride(span => {
        const newSpan = new Span({
          action: overrideAction,
          namespace: "test",
          tags: overrideTags
        })
        return newSpan
      })

      // Send error with original span properties using callback
      const error = new Error("test error")
      const result = await appsignal.sendError(error, span => {
        span.setAction(originalAction)
        span.setTags(originalTags)
      })

      // Verify the returned span has the override properties, not the original
      expect(result).toBeDefined()
      const returnedSpan = result as Span
      expect(returnedSpan.serialize().action).toBe(overrideAction)
      expect(returnedSpan.serialize().tags).toStrictEqual(overrideTags)
      expect(returnedSpan.serialize().action).not.toBe(originalAction)
      expect(returnedSpan.serialize().tags).not.toStrictEqual(originalTags)
    })

    it("uses original span when override returns undefined", async () => {
      const originalAction = "original action"
      const originalTags = { original: "tag" }

      // Add override that modifies the span but doesn't return it (returns undefined)
      appsignal.addOverride((((span: Span) => {
        span.setAction("modified action")
        // Explicitly return undefined to test the fallback behavior
        return undefined
      }) as unknown) as Override)

      // Send error with original span properties
      const error = new Error("test error")
      const result = await appsignal.sendError(error, span => {
        span.setAction(originalAction)
        span.setTags(originalTags)
      })

      // Verify the returned span has the in-place modifications (even though override returned undefined)
      expect(result).toBeDefined()
      const returnedSpan = result as Span
      expect(returnedSpan.serialize().action).toBe("modified action")
      expect(returnedSpan.serialize().tags).toStrictEqual(originalTags)
    })
  })

  describe("addBreadcrumbs", () => {
    it("adds breadcrumbs", async () => {
      appsignal.addBreadcrumb({
        category: "test",
        action: "test action"
      })

      // assert that we always able to return a span from sendError
      const firstSpan = (await appsignal.sendError(new Error())) as Span
      expect(firstSpan.serialize().breadcrumbs!.length).toBe(1)

      appsignal.addBreadcrumb({
        category: "test",
        action: "test action 2"
      })

      // assert that we always able to return a span from sendError
      const secondSpan = (await appsignal.sendError(new Error())) as Span
      expect(secondSpan.serialize().breadcrumbs!.length).toBe(1)
    })

    it("sanitizes metadata", async () => {
      appsignal.addBreadcrumb({
        category: "test",
        action: "test action",
        metadata: {
          value1: true,
          value2: ([1] as unknown) as string
        }
      })

      // assert that we always able to return a span from sendError
      const span = (await appsignal.sendError(new Error())) as Span
      expect(span.serialize().breadcrumbs![0].metadata!.value1).toBe(true)
      expect(span.serialize().breadcrumbs![0].metadata!.value2).toBe("[1]")
    })
  })
})
