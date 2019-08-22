import { Serializable } from "./serializable"
import { getStacktrace } from "./utils/stacktrace"
import { sanitizeParams } from "./utils/object"
import { Span as AppsignalSpan } from "./types/span"

export class Span extends Serializable<AppsignalSpan> {
  constructor(span?: Partial<AppsignalSpan>) {
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
    if (!name || typeof name !== "string") {
      return this
    }

    this._data.action = name
    return this
  }

  public setNamespace(name: string): this {
    if (!name || typeof name !== "string") {
      return this
    }

    this._data.namespace = name
    return this
  }

  public setError<T extends Error>(error: Error | T): this {
    if (!error) return this

    this._data.error = {
      name: error.name || "Error",
      message: error.message || "No message given",
      backtrace: getStacktrace(error)
    }

    return this
  }

  public setTags(tags: object): this {
    this._data.tags = { ...this._data.tags, ...sanitizeParams(tags) }
    return this
  }

  public setParams(params: object): this {
    this._data.params = { ...this._data.params, ...sanitizeParams(params) }
    return this
  }
}
