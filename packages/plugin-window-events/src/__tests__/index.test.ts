import type { JSClient } from "@appsignal/types"
import { plugin } from "../index"

describe("windowEventsPlugin", () => {
  const ctx = window as Window

  const setActionMock = jest.fn()
  const setErrorMock = jest.fn()

  const mockAppsignal = ({
    createSpan: jest.fn().mockImplementation(() => ({
      setAction: setActionMock,
      setError: setErrorMock
    })),
    send: jest.fn()
  } as unknown) as JSClient

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("responds to options object", () => {
    const opts = {
      onerror: false,
      onunhandledrejection: false
    }

    plugin(opts).bind(mockAppsignal)

    expect(ctx.onerror).toBeNull()
    expect(ctx.onunhandledrejection).toBeNull()
  })

  describe("window.onerror handler", () => {
    it("can be called with an error parameter", () => {
      plugin({}).call(mockAppsignal)

      const msg = "test error"
      const error = new Error(msg)

      ctx.onerror!(msg, "test", 1, 1, error)

      expect(mockAppsignal.createSpan).toHaveBeenCalled()
      expect(setErrorMock).toHaveBeenCalledWith(error)
    })

    it("can be called without an error parameter", () => {
      plugin({}).call(mockAppsignal)

      const msg = "test error"

      ctx.onerror!(msg, "test", 1, 1)

      expect(mockAppsignal.createSpan).toHaveBeenCalled()

      expect(setErrorMock).toHaveBeenCalledWith({
        name: "Error",
        message: msg,
        stack: "at test:1:1"
      })
    })
  })

  describe("window.onunhandledrejection handler", () => {
    it("can be called with a generic reason", () => {
      plugin({}).call(mockAppsignal)

      ctx.onunhandledrejection!({ reason: "test" } as PromiseRejectionEvent)

      expect(mockAppsignal.createSpan).toHaveBeenCalled()

      expect(setErrorMock).toHaveBeenCalledWith({
        name: "UnhandledPromiseRejectionError",
        message: "test"
      })
    })

    it("can handle an error object as a reason", () => {
      plugin({}).call(mockAppsignal)

      const msg = "test error"
      const error = new Error(msg)

      ctx.onunhandledrejection!({ reason: error } as PromiseRejectionEvent)

      expect(mockAppsignal.createSpan).toHaveBeenCalled()

      expect(setErrorMock).toHaveBeenCalledWith(error)
    })

    it("handles a promise rejection with an circular structure as a reason", () => {
      plugin({}).call(mockAppsignal)

      // Create circular reference in the reason object
      const reason = {
        abc: "def",
        foo: "bar",
        reason: {},
        nested: { inside: {} }
      }
      reason.reason = reason
      reason.nested.inside = reason.nested
      ctx.onunhandledrejection!({ reason } as PromiseRejectionEvent)

      expect(mockAppsignal.createSpan).toHaveBeenCalled()

      expect(setErrorMock).toHaveBeenCalledWith({
        name: "UnhandledPromiseRejectionError",
        message:
          `{"abc":"def","foo":"bar",` +
          `"reason":"[cyclic value: root object]",` +
          `"nested":{"inside":"[cyclic value: nested]"}}`
      })
    })

    it("can handle a promise rejection without a reason", () => {
      plugin({}).call(mockAppsignal)

      ctx.onunhandledrejection!({} as PromiseRejectionEvent)

      expect(mockAppsignal.createSpan).toHaveBeenCalled()

      expect(setErrorMock).toHaveBeenCalledWith({
        name: "UnhandledPromiseRejectionError",
        message: ""
      })
    })

    it("can handle a promise rejection without an argument", () => {
      plugin({}).call(mockAppsignal)

      ctx.onunhandledrejection!((undefined as unknown) as PromiseRejectionEvent)

      expect(mockAppsignal.createSpan).toHaveBeenCalled()

      expect(setErrorMock).toHaveBeenCalledWith({
        name: "UnhandledPromiseRejectionError",
        message: ""
      })
    })
  })
})
