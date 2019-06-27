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
    expect(appsignal.VERSION).toEqual("1.0.0")
  })

  describe("sendError", () => {
    it("pushes an error to the API", () => {
      const message = "test error"
      const promise = appsignal.send(new Error(message))

      expect(promise).resolves
    })
  })
})
