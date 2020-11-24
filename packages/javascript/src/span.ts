import { Serializable, getStacktrace, toHashMapString } from "@appsignal/core"
import type {
  JSSpanData,
  Breadcrumb,
  HashMap,
  HashMapValue
} from "@appsignal/types"

export class Span extends Serializable<JSSpanData> {
  constructor(span?: Partial<JSSpanData>) {
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
      name: error.name || "[unknown]",
      message:
        error.message ||
        "setError received an invalid object or type which did not provide an error message or was not an object with a valid message property.\n\nHere's some more information about what we received:\n\n" +
          `typeof: ${typeof error}\n` +
          `constructor.name: ${
            error.constructor.name ?? "[no constructor]"
          }\n` +
          `As a string: "${
            typeof error !== "string" ? JSON.stringify(error) : error
          }"`,
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
