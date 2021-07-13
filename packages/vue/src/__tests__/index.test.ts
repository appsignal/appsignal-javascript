import Vue, { App, createApp } from "vue"
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

  it("works in vue 2", () => {
    const TAG_NAME = "testaction"
    const err = new Error("test")
    const version = "v2.0.0"

    const vue2Mock: any = {
      $vnode: {
        componentOptions: {
          tag: TAG_NAME
        }
      }
    }

    errorHandler(appsignal, { version } as App)(err, vue2Mock, "INFO")

    expect(mock.setAction).toBeCalledWith(TAG_NAME)

    expect(mock.setTags).toBeCalledWith({
      framework: "Vue",
      info: "INFO",
      version
    })

    expect(mock.setError).toBeCalledWith(err)

    expect(appsignal.send).toBeCalled()
  })

  it("works in vue 3", () => {
    const FILE = "testaction.vue"
    const PATH = `/workspaces/app/${FILE}`
    const err = new Error("test")

    const vue3viteMock: any = {
      $options: {
        __file: PATH
      }
    }

    errorHandler(appsignal, createApp({}))(err, vue3viteMock, "INFO")

    expect(mock.setAction).toBeCalledWith(FILE)

    expect(mock.setTags).toBeCalledWith({
      framework: "Vue",
      info: "INFO",
      version: createApp({}).version
    })

    expect(mock.setError).toBeCalledWith(err)

    expect(appsignal.send).toBeCalled()
  })
})
