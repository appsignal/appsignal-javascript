import { AppsignalErrorHandler } from "../index"

describe("Angular handleError", () => {
  let appsignal: any

  const mock: any = {
    setError: jest.fn(() => mock),
    setTags: jest.fn(() => mock)
  }

  const SpanMock = jest.fn().mockImplementation(() => mock)

  beforeEach(() => {
    appsignal = {
      createSpan: () => new SpanMock(),
      send: jest.fn()
    }
  })

  it("calls AppSignal helper methods", () => {
    const err = new Error("test")
    const errorHandler = new AppsignalErrorHandler(appsignal)

    errorHandler.handleError(err)

    expect(mock.setError).toBeCalledWith(err)
    expect(mock.setTags).toBeCalledWith({
      framework: "Angular"
    })

    expect(appsignal.send).toBeCalledWith(mock)
  })
})
