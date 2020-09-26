import Vue from "vue"
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

  it("works", () => {
    const TAG_NAME = "testaction"
    const err = new Error("test")

    const vueMock: any = {
      $vnode: {
        componentOptions: {
          tag: TAG_NAME
        }
      }
    }

    errorHandler(appsignal, Vue)(err, vueMock, "INFO")

    expect(mock.setAction).toBeCalledWith(TAG_NAME)

    expect(mock.setTags).toBeCalledWith({
      framework: "Vue",
      info: "INFO",
      version: Vue.version
    })

    expect(mock.setError).toBeCalledWith(err)

    expect(appsignal.send).toBeCalled()
  })
})
