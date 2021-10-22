import { VueApp } from "../types"
import { errorHandler } from "../index"

describe("Vue errorHandler", () => {
  let appsignal: any

  const mock: any = {
    setAction: jest.fn(() => mock),
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

  it("calls AppSignal helper methods when Vue 2", () => {
    const TAG_NAME = "testactionV2"
    const err = new Error("test")
    const version = "v2.0.0"

    const vue2Mock: any = {
      $vnode: {
        componentOptions: {
          tag: TAG_NAME
        }
      }
    }

    errorHandler(appsignal, { version } as VueApp)(err, vue2Mock, "INFO")

    expect(mock.setAction).toBeCalledWith(TAG_NAME)

    expect(mock.setTags).toBeCalledWith({
      framework: "Vue",
      info: "INFO",
      version: version
    })

    expect(mock.setError).toBeCalledWith(err)

    expect(appsignal.send).toBeCalled()
  })

  it("calls AppSignal helper methods when Vue 3", () => {
    const TAG_NAME = "testactionV3"
    const err = new Error("test")
    const version = "v3.0.0"

    const vue3Mock: any = {
      $options: {
        name: TAG_NAME
      }
    }

    errorHandler(appsignal, { version } as VueApp)(err, vue3Mock, "INFO")

    expect(mock.setAction).toBeCalledWith(TAG_NAME)

    expect(mock.setTags).toBeCalledWith({
      framework: "Vue",
      info: "INFO",
      version: version
    })
  })
})
