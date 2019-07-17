import { Span } from "./span"

export class Queue {
  private _data: Span[]

  constructor(data = []) {
    this._data = data
  }

  public clear() {
    this._data = []
  }

  public values(): Span[] {
    return this._data
  }

  public push(item: Span | Span[]) {
    Array.isArray(item) ? this._data.concat(item) : this._data.push(item)
  }

  public *drain() {
    while (this._data.length > 0) {
      yield this._data.shift()
    }
  }
}
