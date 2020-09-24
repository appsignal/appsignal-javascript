import { Serializable, getStacktrace, toHashMapString } from "@appsignal/core"
import { SpanData, Breadcrumb, HashMap, HashMapValue } from "@appsignal/types"

export class Span extends Serializable<SpanData> {
  constructor(span?: Partial<SpanData>) {
    super({
      timestamp: Math.round(new Date().getTime() / 1000),
      namespace: "frontend",
      error: {
        name: "NullError",
        message: "No error has been set",
        backtrace: []
      },
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
      message:
        error.message ||
        `setError received "${
          typeof error !== "string" ? JSON.stringify(error) : error
        }", which did not provide an error message, or was not an object with a valid message property`,
      backtrace: getStacktrace(error)
    }

    return this
  }

  public setTags(tags: HashMap<string>): this {
    this._data.tags = { ...this._data.tags, ...toHashMapString(tags) }
    return this
  }

  public setParams(params: HashMap<HashMapValue>): this {
    this._data.params = { ...this._data.params, ...params }
    return this
  }

  public setBreadcrumbs(breadcrumbs: Breadcrumb[]): this {
    this._data.breadcrumbs = breadcrumbs
    return this
  }
}
