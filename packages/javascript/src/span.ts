import {
  Serializable,
  getStacktrace,
  toHashMapString,
  isError
} from "@appsignal/core"
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
    if (!error || !isError(error)) return this

    this._data.error = {
      name: error.name || "[unknown]",
      message: error.message,
      backtrace: getStacktrace(error)
    }

    return this
  }

  public setTags(tags: HashMap<string>): this {
    this._data.tags = { ...this._data.tags, ...toHashMapString(tags) }
    return this
  }

  public setParams(params: HashMap<any>): this {
    this._data.params = { ...this._data.params, ...params }
    return this
  }

  public setBreadcrumbs(breadcrumbs: Breadcrumb[]): this {
    this._data.breadcrumbs = breadcrumbs
    return this
  }

  // @private
  // Do not use this function directly. Instead, set the `matchPath`
  // configuration option when initializing AppSignal.
  public cleanBacktracePath(matchPath: RegExp | RegExp[]): this {
    if (matchPath instanceof RegExp) {
      matchPath = [matchPath]
    }

    if (!Array.isArray(matchPath)) {
      return this
    }

    if (!this._data.error || !this._data.error.backtrace) {
      return this
    }

    this._data.error.backtrace = this._data.error.backtrace.map(line => {
      const path = extractPath(line)
      if (!path) {
        return line
      }

      for (const matcher of matchPath as RegExp[]) {
        if (!(matcher instanceof RegExp)) {
          continue
        }

        const match = path.match(matcher)
        if (!match) {
          continue
        }

        const relevantPath = match[1]
        if (relevantPath) {
          return line.replace(path, match[1])
        }
      }

      return line
    })

    return this
  }
}

// Backtrace formats are different between browsers, and generally not
// meant to be parsed by machines. This function does a best-effort to
// extract whatever is at the location in the line where the path
// usually appears.
//
// If it returns `undefined`, it means that it could not find where the
// path is located in the backtrace line. If it returns a string, that
// string _may_ be a path, but it may contain non-path elements as well.
function extractPath(backtraceLine: string): string | undefined {
  // A Chrome backtrace line always contains `at` near the beginning,
  // preceded by space characters and followed by one space.
  const IS_CHROME = /^\s*at\s/
  // In a Chrome backtrace line, the path (if it is available)
  // is located, usually within parentheses, after the "@" towards the
  // end of the line, along with the line number and column number,
  // separated by colons. We check for those to reject clear non-paths.
  const CHROME_PATH = /at(?:\s.*)?\s\(?(.*):\d*:\d*\)?$/i

  if (backtraceLine.match(IS_CHROME)) {
    const match = backtraceLine.match(CHROME_PATH)
    return match ? match[1] : undefined
  }

  // A Safari or Firefox backtrace line always contains `@` after the first
  // term in the line.
  const IS_SAFARI_FF = /^.*@/

  // In a Safari or Firefox backtrace line, the path (if it is available)
  // is located after the "@" at the towards end of the line, followed by
  // the line number and column number, separated by colons. We check for
  // those to reject clear non-paths.
  const SAFARI_FF_PATH = /@\s?(.*):\d*:\d*$/i

  if (backtraceLine.match(IS_SAFARI_FF)) {
    const match = backtraceLine.match(SAFARI_FF_PATH)
    return match ? match[1] : undefined
  }
}
