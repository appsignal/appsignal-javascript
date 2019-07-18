import { Dispatcher } from "../dispatcher"
import { Queue } from "../queue"
import { PushApi } from "../api"
import { Span } from "../span"

jest.mock("../api")

describe("Dispatcher", () => {
  let dispatcher: Dispatcher

  beforeEach(() => {
    const api = new PushApi({ key: "test", version: "test" })
    const queue = new Queue()

    queue.push(new Span({}))

    dispatcher = new Dispatcher(queue, api, { initialDuration: 10 })

    jest.useFakeTimers()
  })

  it("schedules a queue item", () => {
    dispatcher.schedule()
    expect(setTimeout).toHaveBeenCalledTimes(1)
  })
})
