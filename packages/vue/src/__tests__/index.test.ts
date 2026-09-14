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

  it("reads from the __name option for composition components in Vue 3", () => {
    const TAG_NAME = "testactionV3"
    const err = new Error("test")
    const version = "v3.0.0"

    const vue3Mock: any = {
      $options: {
        __name: TAG_NAME
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

  it("falls back to the basename of the __file option in Vue 3", () => {
    const err = new Error("test")
    const version = "v3.0.0"

    const vue3Mock: any = {
      $options: {
        __file: "src/components/TestComponent.vue"
      }
    }

    errorHandler(appsignal, { version } as VueApp)(err, vue3Mock, "INFO")

    expect(mock.setAction).toBeCalledWith("TestComponent")
  })

  it("reads a basename-only __file option as exposed in production builds", () => {
    const err = new Error("test")
    const version = "v3.0.0"

    const vue3Mock: any = {
      $options: {
        __file: "TestComponent.vue"
      }
    }

    errorHandler(appsignal, { version } as VueApp)(err, vue3Mock, "INFO")

    expect(mock.setAction).toBeCalledWith("TestComponent")
  })

  it("prefers an explicit name over the __file option", () => {
    const err = new Error("test")
    const version = "v3.0.0"

    const vue3Mock: any = {
      $options: {
        name: "ExplicitName",
        __file: "src/components/TestComponent.vue"
      }
    }

    errorHandler(appsignal, { version } as VueApp)(err, vue3Mock, "INFO")

    expect(mock.setAction).toBeCalledWith("ExplicitName")
  })

  it("reports an unknown component when Vue 3 passes a null instance", () => {
    const err = new Error("test")
    const version = "v3.0.0"

    errorHandler(appsignal, { version } as VueApp)(err, null, "INFO")

    expect(mock.setAction).toBeCalledWith("[unknown Vue component]")

    expect(mock.setError).toBeCalledWith(err)

    expect(appsignal.send).toBeCalled()
  })

  it("reports an unknown component when no name source is present", () => {
    const err = new Error("test")
    const version = "v3.0.0"

    const vue3Mock: any = {
      $options: {}
    }

    errorHandler(appsignal, { version } as VueApp)(err, vue3Mock, "INFO")

    expect(mock.setAction).toBeCalledWith("[unknown Vue component]")
  })
})
