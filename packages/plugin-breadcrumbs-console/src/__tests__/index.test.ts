import type { JSClient } from "@appsignal/types"
import { plugin } from "../index"

describe("BreadcrumbsConsolePlugin", () => {
  const logMock = jest.spyOn(console, "log").mockImplementation(() => {})
  const debugMock = jest.spyOn(console, "debug").mockImplementation(() => {})
  const infoMock = jest.spyOn(console, "info").mockImplementation(() => {})
  const warnMock = jest.spyOn(console, "warn").mockImplementation(() => {})
  const errorMock = jest.spyOn(console, "error").mockImplementation(() => {})
  const addBreadcrumb = jest.fn()

  const mockAppsignal = ({ addBreadcrumb } as unknown) as JSClient
  plugin({}).call(mockAppsignal)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("when console.log is called", () => {
    it("adds breadcrumb", () => {
      const message = "This is a log message"
      console.log(message)

      expect(logMock).toHaveBeenCalledWith(message)
      expect(addBreadcrumb).toHaveBeenCalledWith({
        action: "Console logged a value",
        category: "console.log",
        metadata: {
          argument0: message
        }
      })
    })
  })

  describe("when console.debug is called", () => {
    it("adds breadcrumb", () => {
      const message = "This is a debug message"
      console.debug(message)

      expect(debugMock).toHaveBeenCalledWith(message)
      expect(addBreadcrumb).toHaveBeenCalledWith({
        action: "Console logged a value",
        category: "console.debug",
        metadata: {
          argument0: message
        }
      })
    })
  })

  describe("when console.info is called", () => {
    it("adds breadcrumb", () => {
      const message = "This is an info message"
      console.info(message)

      expect(infoMock).toHaveBeenCalledWith(message)
      expect(addBreadcrumb).toHaveBeenCalledWith({
        action: "Console logged a value",
        category: "console.info",
        metadata: {
          argument0: message
        }
      })
    })
  })

  describe("when console.warn is called", () => {
    it("adds breadcrumb", () => {
      const message = "This is a warn message"
      console.warn(message)

      expect(warnMock).toHaveBeenCalledWith(message)
      expect(addBreadcrumb).toHaveBeenCalledWith({
        action: "Console logged a value",
        category: "console.warn",
        metadata: {
          argument0: message
        }
      })
    })
  })

  describe("when console.error is called", () => {
    it("adds breadcrumb", () => {
      const message = "This is an error message"
      console.error(message)

      expect(errorMock).toHaveBeenCalledWith(message)
      expect(addBreadcrumb).toHaveBeenCalledWith({
        action: "Console logged a value",
        category: "console.error",
        metadata: {
          argument0: message
        }
      })
    })
  })

  describe("when console function is called with multiple arguments", () => {
    it("adds breadcrumb with multiple arguments", () => {
      console.log("a", "b", 3)

      expect(logMock).toHaveBeenCalledWith("a", "b", 3)
      expect(addBreadcrumb).toHaveBeenCalledWith({
        action: "Console logged some values",
        category: "console.log",
        metadata: {
          argument0: "a",
          argument1: "b",
          argument2: "3"
        }
      })
    })
  })

  describe("when console function is called with a normal object argument", () => {
    it("adds breadcrumb without argument", () => {
      const obj = { value1: "abc", nested: { value2: "def" } }
      console.log(obj)

      expect(logMock).toHaveBeenCalledWith(obj)
      expect(errorMock).not.toHaveBeenCalled()
      expect(addBreadcrumb).toHaveBeenCalledWith({
        action: "Console logged a value",
        category: "console.log",
        metadata: {
          argument0: `{"value1":"abc","nested":{"value2":"def"}}`
        }
      })
    })
  })

  describe("when console function is called with a circular argument", () => {
    it("adds breadcrumb without argument", () => {
      const obj: { [key: string]: string | object } = { value1: "abc" }
      obj.obj = obj
      console.log(obj)

      expect(logMock).toHaveBeenCalledWith(obj)
      expect(errorMock).toHaveBeenCalledTimes(1)
      expect(errorMock).toHaveBeenCalledWith(
        'Could not serialize "console.log" to String.',
        expect.any(Error)
      )
      expect(addBreadcrumb).toHaveBeenCalledWith({
        action: "Console logged a value",
        category: "console.log",
        metadata: {
          argument0: "[Value could not be serialized]"
        }
      })
    })
  })
})
