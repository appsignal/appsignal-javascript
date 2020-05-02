import sinon from "sinon"

import { Dispatcher } from "../../dispatcher"
import { Queue } from "../../queue"
import { PushApi } from "../../api"
import { Span } from "../../span"

const { describe, it, beforeEach } = intern.getPlugin("interface.bdd")
const { expect } = intern.getPlugin("chai")

describe("Dispatcher", () => {
  let dispatcher: Dispatcher
  let clock: sinon.SinonFakeTimers

  beforeEach(() => {
    const api = new PushApi({ key: "test", version: "test" })
    const queue = new Queue()

    queue.push(new Span({}))

    dispatcher = new Dispatcher(queue, api, { initialDuration: 10 })

    clock = sinon.useFakeTimers()
  })

  it("schedules a queue item", () => {
    dispatcher.schedule()
    expect(clock.countTimers()).to.equal(1)
  })
})
