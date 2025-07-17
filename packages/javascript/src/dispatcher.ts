import { getGlobalObject } from "./environment"

import { Queue } from "./queue"
import { PushApi } from "./api"

type DispatcherOptions = { limit: number; initialDuration: number }

export class Dispatcher {
  public options: DispatcherOptions

  private _queue: Queue
  private _api: PushApi
  private _retries = 0
  private _timerID = 0
  private _duration = 0

  constructor(
    queue: Queue,
    api: PushApi,
    options?: Partial<DispatcherOptions>
  ) {
    this._api = api
    this._queue = queue

    this.options = {
      limit: 5,
      initialDuration: 1000,
      ...options
    }

    this.reset()
  }

  public schedule(time = this._duration): number {
    const globals = getGlobalObject<Window>()

    // @TODO: make this configurable?
    const BACKOFF_FACTOR = 1.3

    const cb = async () => {
      for (let span of this._queue.drain()) {
        if (!span) return

        try {
          await this._api.push(span)
        } catch (e) {
          // when the first promise fails, reschedule a timer
          const expDuration = Math.floor(Math.pow(time, BACKOFF_FACTOR))

          this._retries = this._retries - 1

          if (this._retries === 0) {
            this.reset()
          } else {
            this._queue.push(span)
            this._timerID = this.schedule(expDuration)
          }

          return
        }
      }

      // reset once all promises are cleared
      this.reset()
    }

    return globals.setTimeout(cb, time)
  }

  public reset() {
    const { limit, initialDuration } = this.options
    this._retries = limit
    this._duration = initialDuration
  }
}
