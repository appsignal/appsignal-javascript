import type { Span } from "@appsignal/javascript"
import { installErrorHandler } from "../index"

describe("Stimulus errorHandler", () => {
  let appsignal: any
  const err = new Error("test")
  const message = "This is a test message"

  const mock: any = {
    setAction: jest.fn(() => mock),
    setError: jest.fn(() => mock),
    setTags: jest.fn(() => mock)
  }

  const SpanMock = jest.fn().mockImplementation(() => mock)

  beforeEach(() => {
    appsignal = {
      createSpan: (fn: (span: Span) => void) => {
        const mock = new SpanMock()
        fn(mock)
        return mock
      },
      send: jest.fn()
    }
  })

  it("calls AppSignal helper methods", () => {
    const detail = { identifier: "foo" }
    const stimulusApplication: any = {}

    installErrorHandler(appsignal, stimulusApplication)

    stimulusApplication.handleError(err, message, detail)

    expect(mock.setAction).toBeCalledWith("foo")

    expect(mock.setTags).toBeCalledWith({
      framework: "Stimulus",
      message
    })

    expect(mock.setError).toBeCalledWith(err)

    expect(appsignal.send).toBeCalled()
  })

  it("calls any previously defined error handler", () => {
    const detail = { identifier: "foo" }
    const originalErrorHandler = jest.fn()
    const stimulusApplication: any = { handleError: originalErrorHandler }

    installErrorHandler(appsignal, stimulusApplication)

    stimulusApplication.handleError(err, message, detail)

    expect(appsignal.send).toBeCalled()
    expect(originalErrorHandler).toBeCalledWith(err, message, detail)
  })

  it("sets the action as undefined if there is no identifier", () => {
    const detail = {}
    const stimulusApplication: any = {}

    installErrorHandler(appsignal, stimulusApplication)

    stimulusApplication.handleError(err, message, detail)

    expect(mock.setAction).toBeCalledWith("[unknown Stimulus controller]")
  })

  it("sets the action as undefined if there is no detail", () => {
    // Stimulus should always provide a detail, but out of an abundance of
    // caution, let's be extra careful to not cause an exception in a default
    // error handler.
    const detail = undefined
    const stimulusApplication: any = {}

    installErrorHandler(appsignal, stimulusApplication)

    stimulusApplication.handleError(err, message, detail)

    expect(mock.setAction).toBeCalledWith("[unknown Stimulus controller]")
  })
})
