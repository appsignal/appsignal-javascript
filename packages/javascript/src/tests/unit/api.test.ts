import sinon from "sinon"

import { VERSION } from "../../version"
import { PushApi } from "../../api"
import { Span } from "../../span"
import { NodeTransport } from "../../transports/node"

const { describe, it, beforeEach } = intern.getPlugin("interface.bdd")
const { expect } = intern.getPlugin("chai")

describe("PushApi", () => {
  let api: PushApi

  let spy: sinon.SinonSpy
  let stub: sinon.SinonStubbedInstance<NodeTransport>

  const FIXTURE = new Span({
    timestamp: 111111,
    namespace: "frontend",
    environment: {},
    error: { name: "TestError" }
  })

  beforeEach(() => {
    // as `_createTransport` returns an environment-specific
    // object, we mock the method out entirely and replace it
    // with a sinon spy
    stub = sinon.createStubInstance(NodeTransport)
    stub.send.resolves({})

    spy = sinon.fake(() => stub)
    PushApi.prototype["_createTransport"] = spy

    api = new PushApi({ key: "TESTKEY", version: VERSION })
  })

  describe("push", () => {
    it("pushes a transaction to the Push API", async () => {
      await api.push(FIXTURE)

      expect(
        spy.calledWithExactly(
          `https://appsignal-endpoint.net/collect?api_key=TESTKEY&version=${VERSION}`
        )
      ).to.equal(true)

      expect(stub.send.calledWith(FIXTURE.toJSON())).to.equal(true)
    })
  })
})
