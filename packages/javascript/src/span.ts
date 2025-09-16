import { getStacktrace, isError } from "./error"
import { Serializable } from "./serializable"
import { toHashMapString } from "./hashmap"
import type { HashMap, HashMapValue } from "./hashmap"

import type { Breadcrumb } from "./breadcrumb"
import type { SpanError } from "./error"
import { BacktraceMatcher } from "./options"

/**
 * The internal data structure of a `Span` inside the JavaScript integration.
 */
export interface SpanData {
  timestamp: number
  action?: string
  namespace: string
  error: SpanError
  revision?: string
  tags?: HashMap<string>
  params?: HashMap<any>
  environment?: HashMap<string>
  breadcrumbs?: Breadcrumb[]
}

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

  public getAction(): string | undefined {
    return this._data.action
  }

  public setNamespace(name: string): this {
    if (!name || typeof name !== "string") {
      return this
    }

    this._data.namespace = name
    return this
  }

  public getNamespace(): string | undefined {
    return this._data.namespace
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

  public getError(): SpanError | undefined {
    return this._data.error
  }

  public setTags(tags: HashMap<string>): this {
    this._data.tags = { ...this._data.tags, ...toHashMapString(tags) }
    return this
  }

  public getTags(): HashMap<string> {
    return this._data.tags ?? {}
  }

  public setParams(params: HashMap<any>): this {
    this._data.params = { ...this._data.params, ...params }
    return this
  }

  public getParams(): HashMap<any> {
    return this._data.params ?? {}
  }

  public setBreadcrumbs(breadcrumbs: Breadcrumb[]): this {
    this._data.breadcrumbs = breadcrumbs
    return this
  }

  public getBreadcrumbs(): Breadcrumb[] {
    return this._data.breadcrumbs ?? []
  }

  public setEnvironment(environment: HashMap<string>): this {
    this._data.environment = { ...this._data.environment, ...environment }
    return this
  }

  public getEnvironment(): HashMap<string> {
    return this._data.environment ?? {}
  }

  // @private
  // Do not use this function directly. Instead, set the `matchBacktracePaths`
  // configuration option when initializing AppSignal.
  public cleanBacktracePath(matchBacktracePaths: BacktraceMatcher[]): this {
    if (matchBacktracePaths.length === 0) {
      return this
    }

    if (!this._data.error || !this._data.error.backtrace) {
      return this
    }

    let linesMatched = 0

    this._data.error.backtrace = this._data.error.backtrace.map(line => {
      const path = extractPath(line)
      if (!path) {
        return line
      }

      for (const matcher of matchBacktracePaths) {
        const relevantPath = matcher(path)
        if (!relevantPath) {
          continue
        }

        linesMatched++
        return line.replace(path, relevantPath)
      }

      return line
    })

    if (linesMatched > 0) {
      this.setEnvironment({
        backtrace_paths_matched: linesMatched.toString()
      })
    }

    return this
  }
}

// @private
// Do not use this function directly. Instead, set the `matchBacktracePaths`
// configuration option when initializing AppSignal.
//
// Converts a `RegExp` object into a `BacktraceMatcher` function that returns
// the concatenated matches from that object.
export function toBacktraceMatcher(regexp: RegExp): BacktraceMatcher {
  return (path: string): string | undefined => {
    const match = path.match(regexp)
    if (!match || match.length < 2) {
      return
    }

    return match.slice(1).join("")
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
