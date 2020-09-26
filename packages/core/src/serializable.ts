export class Serializable<T = [] | {}> {
  protected _data: T

  constructor(data: T) {
    this._data = data
  }

  public toJSON(): string {
    return JSON.stringify(this._data)
  }

  public serialize(): T {
    return this._data
  }
}
