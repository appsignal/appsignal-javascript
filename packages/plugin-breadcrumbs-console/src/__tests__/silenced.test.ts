import type { JSClient } from "@appsignal/types"
import { plugin } from "../index"

describe("BreadcrumbsConsolePlugin - console silenced", () => {
  const debugMock = jest.spyOn(console, "debug").mockImplementation(() => {})
  const infoMock = jest.spyOn(console, "info").mockImplementation(() => {})
  const warnMock = jest.spyOn(console, "warn").mockImplementation(() => {})
  const addBreadcrumb = jest.fn()

  const mockAppsignal = ({addBreadcrumb} as unknown) as JSClient
  plugin({silenceConsoleMethods: ["debug", "info"]}).call(mockAppsignal)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("when console.debug is called", () => {
    it("adds breadcrumb", () => {
      const message = "This is a debug message"
      console.debug(message)

      expect(debugMock).not.toHaveBeenCalledWith(message)
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

      expect(infoMock).not.toHaveBeenCalledWith(message)
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

})
