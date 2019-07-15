import { Serializable } from "./serializable"
import { getStacktrace } from "./utils/stacktrace"
import { Span as AppsignalSpan } from "./types/span"

export class Span extends Serializable<AppsignalSpan> {
  constructor(span: Partial<AppsignalSpan>) {
    super({
      timestamp: Math.round(new Date().getTime() / 1000),
      namespace: "frontend",
      revision: "",
      error: {
        name: "",
        message: "",
        backtrace: []
      },
      environment: {},
      tags: {},
      params: {},
      ...span
    })
  }

  public setAction(name: string): this {
    this._data.action = name
    return this
  }

  public setNamespace(name: string): this {
    this._data.namespace = name
    return this
  }

  public setError<T extends Error>(error: Error | T): this {
    const { name, message } = error

    this._data.error = {
      name,
      message,
      backtrace: getStacktrace(error)
    }

    return this
  }

  public setTags(tags: object): this {
    this._data.tags = { ...this._data.tags, ...tags }
    return this
  }

  public setParams(params: object): this {
    this._data.params = { ...this._data.params, ...params }
    return this
  }
}
