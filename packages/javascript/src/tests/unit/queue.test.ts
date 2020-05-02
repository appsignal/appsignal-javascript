import sinon from "sinon"

import { Queue } from "../../queue"
import { Span } from "../../span"

const { describe, it, beforeEach } = intern.getPlugin("interface.bdd")
const { expect } = intern.getPlugin("chai")

describe("Queue", () => {
  let q: Queue

  beforeEach(() => {
    /* Runs before each test */
    q = new Queue()
  })

  it("can be initialized with items", () => {
    const items = [new Span({})]
    q = new Queue(items)
    expect(q.values().length).to.equal(1)
  })

  describe("clear", () => {
    it("clears the queue", () => {
      q.clear()
      expect(q.values().length).to.equal(0)
    })
  })

  describe("push", () => {
    it("pushes a single item to the queue", () => {
      q.push(new Span({}))

      expect(q.values().length).to.equal(1)
    })

    it("pushes multiple items to the queue", () => {
      const items = [new Span({}), new Span({})]
      q.push(items)
      expect(q.values().length).to.equal(2)
    })
  })

  describe("drain", () => {
    it("can drain the queue", () => {
      const fn = sinon.fake()

      q.push(new Span({}))

      for (let item of q.drain()) {
        fn(item)
      }

      expect(fn.called).to.equal(true)
      expect(q.values().length).to.equal(0)
    })
  })
})
