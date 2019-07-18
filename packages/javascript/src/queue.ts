import { Span } from "./span"

export class Queue {
  private _data: Span[]

  constructor(data?: Span[]) {
    this._data = data || []
  }

  public clear() {
    this._data = []
  }

  public values(): Span[] {
    return this._data
  }

  public push(item: Span | Span[]) {
    this._data.push(...item)
  }

  public *drain() {
    while (this._data.length > 0) {
      yield this._data.shift()
    }
  }
}
