import { plugin } from "../index"

describe("windowEventsPlugin", () => {
  const ctx = window as Window

  const setActionMock = jest.fn()
  const setErrorMock = jest.fn()

  const mockAppsignal = {
    createEvent: jest.fn().mockImplementation(() => ({
      setAction: setActionMock,
      setError: setErrorMock
    })),
    send: jest.fn()
  }

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

      expect(mockAppsignal.createEvent).toHaveBeenCalled()
      expect(setActionMock).toHaveBeenCalledWith("window.onerror")
      expect(setErrorMock).toHaveBeenCalledWith(error)
    })

    it("can be called without an error parameter", () => {
      plugin({}).call(mockAppsignal)

      const msg = "test error"

      ctx.onerror!(msg, "test", 1, 1)

      expect(mockAppsignal.createEvent).toHaveBeenCalled()
      expect(setActionMock).toHaveBeenCalledWith("window.onerror")

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

      expect(mockAppsignal.createEvent).toHaveBeenCalled()
      expect(setActionMock).toHaveBeenCalledWith("window.onunhandledrejection")

      expect(setErrorMock).toHaveBeenCalledWith({
        name: "UnhandledPromiseRejectionError",
        message: "test",
        stack: ""
      })
    })

    it("can handle an error object as a reason", () => {
      plugin({}).call(mockAppsignal)

      const msg = "test error"
      const error = new Error(msg)

      ctx.onunhandledrejection!({ reason: error } as PromiseRejectionEvent)

      expect(mockAppsignal.createEvent).toHaveBeenCalled()
      expect(setActionMock).toHaveBeenCalledWith("window.onunhandledrejection")

      expect(setErrorMock).toHaveBeenCalledWith({
        name: "UnhandledPromiseRejectionError",
        message: "{}",
        stack: error.stack
      })
    })
  })
})
