import { VERSION } from "../version"

import Appsignal from "../index"
import { PushApi } from "../api"

jest.mock("../api")

describe("Appsignal", () => {
  let appsignal: Appsignal

  beforeEach(() => {
    /* Runs before each test */
    appsignal = new Appsignal({ key: "TESTKEY" })
  })

  it("exposes a valid version number", () => {
    expect(appsignal.VERSION).toEqual(VERSION)
  })

  describe("sendError", () => {
    it("pushes an error to the API", () => {
      const message = "test error"
      const promise = appsignal.sendError(new Error(message))

      expect(promise).resolves
    })
  })
})
