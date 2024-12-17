import { installErrorHandler } from "../index"
import type { JSSpan } from "@appsignal/types"

describe("Stimulus errorHandler", () => {
  let appsignal: any

  const mock: any = {
    setAction: jest.fn(() => mock),
    setError: jest.fn(() => mock),
    setTags: jest.fn(() => mock)
  }

  const SpanMock = jest.fn().mockImplementation(() => mock)

  beforeEach(() => {
    appsignal = {
      createSpan: (fn: (span: JSSpan) => void) => {
        const mock = new SpanMock()
        fn(mock)
        return mock
      },
      send: jest.fn()
    }
  })

  it("calls AppSignal helper methods", () => {
    const err = new Error("test")
    const message = "This is a test message"
    const detail = { identifier: "foo" }

    const stimulusApplication: any = {}

    installErrorHandler(appsignal, stimulusApplication)

    stimulusApplication.handleError(err, message, detail)

    expect(mock.setAction).toBeCalledWith("foo-controller")

    expect(mock.setTags).toBeCalledWith({
      framework: "Stimulus",
      message
    })

    expect(mock.setError).toBeCalledWith(err)

    expect(appsignal.send).toBeCalled()
  })

  it("calls any previously defined error handler", () => {
    const err = new Error("test")
    const message = "This is a test message"
    const detail = { identifier: "foo" }

    const originalErrorHandler = jest.fn()
    const stimulusApplication: any = { handleError: originalErrorHandler }

    installErrorHandler(appsignal, stimulusApplication)

    stimulusApplication.handleError(err, message, detail)

    expect(appsignal.send).toBeCalled()
    expect(originalErrorHandler).toBeCalledWith(err, message, detail)
  })
})
