import { Queue } from "../queue"
import { Span } from "../span"

describe("Queue", () => {
  let q: Queue

  beforeEach(() => {
    /* Runs before each test */
    q = new Queue()
  })

  it("can be initialized with items", () => {
    const items = [new Span({})]
    q = new Queue(items)
    expect(q.values().length).toEqual(1)
  })

  describe("clear", () => {
    it("clears the queue", () => {
      q.clear()
      expect(q.values().length).toEqual(0)
    })
  })

  describe("push", () => {
    it("pushes a single item to the queue", () => {
      q.push(new Span({}))

      expect(q.values().length).toEqual(1)
    })

    it("pushes multiple items to the queue", () => {
      const items = [new Span({}), new Span({})]
      q.push(items)
      expect(q.values().length).toEqual(2)
    })
  })

  describe("drain", () => {
    it("can drain the queue", () => {
      const fn = jest.fn()

      q.push(new Span({}))

      for (let item of q.drain()) {
        fn(item)
      }

      expect(fn).toHaveBeenCalledTimes(1)
      expect(q.values().length).toEqual(0)
    })
  })
})
