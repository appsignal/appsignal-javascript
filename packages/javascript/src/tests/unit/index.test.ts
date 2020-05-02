import sinon from "sinon"

import { VERSION } from "../../version"
import Appsignal from "../../index"
import { Span } from "../../span"

const { describe, it, beforeEach } = intern.getPlugin("interface.bdd")
const { expect } = intern.getPlugin("chai")

describe("Appsignal", () => {
  let appsignal: Appsignal

  beforeEach(() => {
    /* Runs before each test */
    appsignal = new Appsignal({ key: "TESTKEY" })
  })

  it("exposes a valid version number", () => {
    expect(appsignal.VERSION).to.equal(VERSION)
  })

  it("recieves a namespace if one is passed to the constructor", () => {
    appsignal = new Appsignal({ key: "TESTKEY", namespace: "test" })

    const span = appsignal.createSpan()
    const result = span.serialize()

    expect(result).to.haveOwnProperty("namespace")
    expect(result.namespace).to.equal("test")
  })

  it("recieves an array of ignored patterns if one is passed to the constructor", () => {
    const ignored = [/Ignore me/gm]

    appsignal = new Appsignal({
      key: "TESTKEY",
      namespace: "test",
      ignoreErrors: ignored
    })

    expect(appsignal.ignored).to.equal(ignored)
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
      const fn = sinon.fake()

      console.warn = fn

      appsignal.send(new Error(name))

      expect(fn.called).to.equal(true)

      // reset
      console.warn = original
    })
  })

  describe("sendError", () => {
    it("pushes an error", test => {
      const message = "test error"
      return appsignal.sendError(new Error(message))
    })

    it("doesn't send an invalid error", () => {
      const spy = sinon.spy(console, "error")

      // we have to do some weird looking type casting here so the
      // compiler doesn't fail and actually allows us to test
      appsignal.sendError(("Test error" as unknown) as Error)

      expect(spy.called).to.equal(true)
      spy.restore()
    })
  })

  describe("wrap", () => {
    it("returns a value if sync function doesn't throw", async () => {
      const value = await appsignal.wrap(() => {
        return 42
      })

      expect(value).to.equal(42)
    })

    it("returns a no value if nothing is returned and function doesn't throw", async () => {
      const value = await appsignal.wrap(() => {
        Math.floor(1.3)
      })

      expect(value).to.equal(undefined)
    })

    it("reports an error if sync function throws", async () => {
      try {
        await appsignal.wrap(() => {
          throw new Error("test error")
        })
      } catch (e) {
        expect(e.message).to.equal("test error")
      }
    })

    it("returns a value if async function doesn't throw", async () => {
      const value = await appsignal.wrap(() => {
        return Promise.resolve(42)
      })

      expect(value).to.equal(42)
    })

    it("reports an error if async function throws", async () => {
      try {
        await appsignal.wrap(async () => {
          throw new Error("test error")
        })
      } catch (e) {
        expect(e.message).to.equal("test error")
      }
    })
  })

  describe("createSpan", () => {
    it("creates a new span given no params", () => {
      const span = appsignal.createSpan()
      const result = span.serialize()

      expect(result).to.haveOwnProperty("timestamp")
      expect(typeof result.timestamp).to.equal("number")
    })

    it("modifies a span when created with a function as a parameter", () => {
      const span = appsignal.createSpan((span: Span) =>
        span.setAction("test action").setError(new Error("test error"))
      )

      const result = span.serialize()

      expect(result.action).to.equal("test action")
      expect(result.error.message).to.equal("test error")
    })
  })

  describe("addDecorator", () => {
    it("adds decorators", async () => {
      const testTag = { tag: "test" }
      const testAction = "test action"

      appsignal.addDecorator(span => span.setAction(testAction))

      // assert that we always able to return a span from sendError
      const firstSpan = (await appsignal.sendError(new Error())) as Span
      expect(firstSpan.serialize().action).to.equal(testAction)

      appsignal.addDecorator(span => span.setTags(testTag))

      // assert that we always able to return a span from sendError
      const secondSpan = (await appsignal.sendError(new Error())) as Span
      expect(secondSpan.serialize().action).to.equal(testAction)
      expect(secondSpan.serialize().tags).to.include(testTag)
    })
  })

  describe("addOverride", () => {
    it("adds overrides", async () => {
      const testTag = { tag: "test" }
      const testAction = "test action"

      appsignal.addOverride(span => span.setAction(testAction))

      // assert that we always able to return a span from sendError
      const firstSpan = (await appsignal.sendError(new Error())) as Span
      expect(firstSpan.serialize().action).to.equal(testAction)

      appsignal.addOverride(span => span.setTags(testTag))

      // assert that we always able to return a span from sendError
      const secondSpan = (await appsignal.sendError(new Error())) as Span
      expect(secondSpan.serialize().action).to.equal(testAction)
      expect(secondSpan.serialize().tags).to.include(testTag)
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
      expect(firstSpan.serialize().breadcrumbs!.length).to.equal(1)

      appsignal.addBreadcrumb({
        category: "test",
        action: "test action 2"
      })

      // assert that we always able to return a span from sendError
      const secondSpan = (await appsignal.sendError(new Error())) as Span
      expect(secondSpan.serialize().breadcrumbs!.length).to.equal(1)
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
      expect(span.serialize().breadcrumbs![0].metadata!.value1).to.equal(true)
      expect(span.serialize().breadcrumbs![0].metadata!.value2).to.equal("[1]")
    })
  })
})
