/**
 * The AppSignal client.
 * @module Appsignal
 */

import type { Breadcrumb } from "./breadcrumb"
export type { Breadcrumb }
import type { Decorator, Override } from "./hook"
import type { HashMap } from "./hashmap"

export { isError } from "./error"

import { toHashMap } from "./hashmap"
import { VERSION } from "./version"
import { PushApi } from "./api"
import { Environment } from "./environment"
import { Span, toBacktraceMatcher } from "./span"
export { Span }
import { Queue } from "./queue"
import { Dispatcher } from "./dispatcher"

import { AppsignalOptions, BacktraceMatcher } from "./options"

export default class Appsignal {
  public VERSION = VERSION
  public ignored: RegExp[] = []
  private backtraceMatchers: BacktraceMatcher[] = []

  private _dispatcher: Dispatcher
  private _options: AppsignalOptions
  private _api: PushApi
  private _breadcrumbs: Breadcrumb[] = []

  private _hooks = {
    decorators: Array<Decorator>(),
    overrides: Array<Override>()
  }

  private _env = Environment.serialize()
  private _queue = new Queue([])

  /**
   * Creates a new instance of the AppSignal client.
   *
   * @constructor
   *
   * @param   {AppsignalOptions}  options        An object of options to configure the AppSignal client
   */
  constructor(options: AppsignalOptions) {
    const {
      key = "",
      uri,
      revision,
      ignoreErrors,
      matchBacktracePaths
    } = options

    // `revision` should be a `string`, but we attempt to
    // normalise to one anyway
    if (revision && typeof revision !== "string") {
      options.revision = String(revision)
    }

    // starting with no key means nothing will be sent to the API
    if (key === "") {
      console.info(
        "[APPSIGNAL]: No API key provided. Started in development mode. No data will be sent."
      )
    }

    this._api = new PushApi({
      key,
      uri,
      version: this.VERSION
    })

    // ignored exceptions are checked against the `message`
    // property of a given `Error`
    if (ignoreErrors && Array.isArray(ignoreErrors)) {
      this.ignored = ignoreErrors
        .filter(value => value instanceof RegExp)
        .map(unglobalize)
    }

    if (matchBacktracePaths) {
      let paths: (RegExp | BacktraceMatcher)[]

      if (Array.isArray(matchBacktracePaths)) {
        paths = matchBacktracePaths
      } else {
        paths = [matchBacktracePaths]
      }

      for (const matcher of paths) {
        if (matcher instanceof RegExp) {
          this.backtraceMatchers.push(toBacktraceMatcher(unglobalize(matcher)))
        } else if (typeof matcher === "function") {
          this.backtraceMatchers.push(matcher)
        }
      }
    }

    this._dispatcher = new Dispatcher(this._queue, this._api)

    this._options = options
  }

  /**
   * Records and sends a browser `Error` to AppSignal.
   *
   * @param   {Error | ErrorEvent}             error          A JavaScript Error object
   * @param   {Function | void}                fn             Optional callback function to modify span before it's sent.
   *
   * @return  {Promise<Span> | void}             An API response, or `void` if `Promise` is unsupported.
   */
  public send<T>(error: Error, fn?: (span: Span) => T): Promise<Span> | void

  /**
   * Records and sends a browser `Error` to AppSignal.
   *
   * @param   {Error | ErrorEvent}             error          A JavaScript Error object
   * @param   {object}                         tags           An key, value object of tags
   * @param   {string}                         namespace      An optional namespace name
   *
   * @return  {Promise<Span> | void}             An API response, or `void` if `Promise` is unsupported.
   */
  public send(
    error: Error | ErrorEvent,
    tags?: object,
    namespace?: string
  ): Promise<Span> | void

  /**
   * Records and sends an Appsignal `Span` object to AppSignal.
   *
   * @param   {Span}             span          An Appsignal Span object
   *
   * @return  {Promise<Span>}                    An API response, or `void` if `Promise` is unsupported.
   */
  public send(span: Span): Promise<Span> | void

  /**
   *
   * @param   {Error | Span | ErrorEvent}  data           A JavaScript Error or Appsignal Span object
   * @param   {object | Function}          tagsOrFn       An key-value object of tags or a callback function to customize the span before it is sent.
   * @param   {string}                     namespace      DEPRECATED: An optional namespace name.
   *
   * @return  {Promise<Span> | void}             An API response, or `void` if `Promise` is unsupported.
   */
  public send<T>(
    data: Error | Span | ErrorEvent,
    tagsOrFn?: object | ((span: Span) => T),
    namespace?: string
  ): Promise<any> | void {
    if (
      !(data instanceof Error) &&
      !(data instanceof Span) &&
      !(data && data.error instanceof Error)
    ) {
      // @TODO: route this through a central logger
      console.error(
        "[APPSIGNAL]: Can't send error, given error is not a valid type"
      )
      return
    }

    let error: Error | Span

    if ("error" in data) {
      error = data.error as Error // handle ErrorEvent
    } else {
      error = data
    }

    // a "span" currently refers to a fixed point in time, as opposed to
    // a range or length in time. this may change in future!
    let span = error instanceof Span ? error : this._createSpanFromError(error)

    // A Span can be "decorated" with metadata after it has been created,
    // but before it is sent to the API and before metadata provided
    // as arguments is added

    for (const decorator of this._hooks.decorators) {
      const previousSpan = span
      span = decorator(span)
      // In previous versions of this integration, the return value was
      // ignored, and the original span was used. This was a bug, but it
      // worked given an implicit expectation that the span would be
      // modified in place.
      //
      // Avoid a breaking change for "broken" decorators that do not
      // return a value by using the previous span.
      if (span === undefined) {
        span = previousSpan
      }
    }

    if (tagsOrFn) {
      if (typeof tagsOrFn === "function") {
        const callback = tagsOrFn
        callback(span)
      } else {
        console.warn(
          "[APPSIGNAL]: DEPRECATED: Calling the `send`/`sendError` function with a tags object is deprecated. Use the callback argument instead."
        )
        const tags = (toHashMap(tagsOrFn) || {}) as HashMap<string>
        span.setTags(tags)
      }
    }
    if (namespace) {
      console.warn(
        "[APPSIGNAL]: DEPRECATED: Calling the `send`/`sendError` function with a namespace is deprecated. Use the callback argument instead."
      )
      span.setNamespace(namespace)
    }

    if (this._breadcrumbs.length > 0) span.setBreadcrumbs(this._breadcrumbs)

    // A Span can be "overridden" with metadata after it has been created,
    // but before it is sent to the API and after metadata provided
    // as arguments is added

    for (const override of this._hooks.overrides) {
      const previousSpan = span
      const nextSpan = override(span)

      if (nextSpan === false) {
        // If the override returns false, we ignore this span.
        console.warn("[APPSIGNAL]: Ignored a span due to override.")
        return
      }

      // In previous versions of this integration, the return value was
      // ignored, and the original span was used. This was a bug, but it
      // worked given an implicit expectation that the span would be
      // modified in place.
      //
      // Avoid a breaking change for "broken" overrides that do not
      // return a value by using the previous span.
      span = nextSpan ?? previousSpan
    }

    // Ignore user defined errors after overrides.
    const message = span.getError()?.message

    if (message && this.ignored.some(el => el.test(message))) {
      console.warn(`[APPSIGNAL]: Ignored a span: ${message}`)
      return
    }

    span.cleanBacktracePath(this.backtraceMatchers)

    if (Environment.supportsPromises()) {
      // clear breadcrumbs as they are now loaded into the span,
      // and we are sure that it's possible to send them
      this._breadcrumbs = []

      // if no key is supplied, we just output the span to the console
      if (!this._options.key) {
        // @TODO: route this through a central logger
        console.warn(
          "[APPSIGNAL]: Span not sent because we're in development mode:",
          span
        )
      } else {
        // attempt to push to the API
        return this._api.push(span).catch(() => {
          this._queue.push(span)

          // schedule on next tick
          setTimeout(() => this._dispatcher.schedule(), 0)
        })
      }
    } else {
      // @TODO: route this through a central logger
      console.error(
        "[APPSIGNAL]: Error not sent. A Promise polyfill is required."
      )
      return
    }
  }

  sendError<T>(error: Error | ErrorEvent): Promise<Span> | void
  sendError<T>(
    error: Error | ErrorEvent,
    callback: (span: Span) => T
  ): Promise<Span> | void
  sendError<T>(
    error: Error | ErrorEvent,
    tags?: object,
    namespace?: string
  ): Promise<Span> | void

  /**
   * Records and sends a browser `Error` to AppSignal. An alias to `#send()`
   * to maintain compatibility.
   *
   * @param   {Error | ErrorEvent}  error          A JavaScript Error object
   * @param   {object | Function}   tagsOrFn       An key-value object of tags or callback function to customize the span before it is sent.
   * @param   {string}              namespace      DEPRECATED: An optional namespace name
   *
   * @return  {Promise<Span> | void}               An API response, or `void` if `Promise` is unsupported.
   */
  public sendError<T>(
    error: Error | ErrorEvent,
    tagsOrFn?: object | ((span: Span) => T),
    namespace?: string
  ): Promise<Span> | void {
    return this.send(error, tagsOrFn, namespace)
  }

  /**
   * Registers and installs a valid plugin.
   *
   * A plugin is typically a function that can be used to provide a
   * reference to the `Appsignal` instance via returning a function
   * that can be bound to `this`.
   *
   * @param   {Plugin}            plugin         A JavaScript Error object
   *
   * @return  {void}
   */
  public use(plugin: Function): void {
    plugin.call(this)
  }

  /**
   * Creates a new `Span`, augmented with the current environment.
   *
   * @param   {Function | void}   fn         Optional function to modify span
   *
   * @return  {Span}              An AppSignal `Span` object
   */
  public createSpan(fn?: (span: Span) => void): Span {
    const { revision = "", namespace } = this._options

    const span = new Span({
      environment: this._env,
      revision
    })

    // set default namespace from constructor if none is set
    if (namespace) span.setNamespace(namespace)

    if (fn && typeof fn === "function") fn(span)

    return span
  }

  /**
   * Wraps and catches errors within a given function. If the function throws an
   * error, a rejected `Promise` will be returned and the error thrown will be
   * logged to AppSignal.
   */
  public async wrap<T>(fn: () => T, callbackFn?: (span: Span) => T): Promise<T>

  /**
   * Wraps and catches errors within a given function. If the function throws an
   * error, a rejected `Promise` will be returned and the error thrown will be
   * logged to AppSignal.
   */
  public async wrap<T>(
    fn: () => T,
    tags?: object,
    namespace?: string
  ): Promise<T>

  /**
   * Wraps and catches errors within a given function. If the function throws an
   * error, a rejected `Promise` will be returned and the error thrown will be
   * logged to AppSignal.
   *
   * @param   {Function}          fn             A function to wrap
   * @param   {object | Function} tagsOrFn       An key-value object of tags or a callback function to customize the span before it is sent.
   * @param   {string}            namespace      DEPRECATED: An optional namespace name
   *
   * @return  {Promise<any>}      A Promise containing the return value of the function, or a `Span` if an error was thrown.
   */
  public async wrap<T>(
    fn: () => T,
    tagsOrFn?: object | ((span: Span) => T),
    namespace?: string
  ): Promise<T> {
    try {
      return await fn()
    } catch (e) {
      if (e instanceof Error || e instanceof ErrorEvent) {
        await this.sendError(e, tagsOrFn, namespace)
      }
      return Promise.reject(e)
    }
  }

  /**
   * Registers a span decorator to be applied every time a Span
   * is sent to the Push API
   *
   * @param   {Function}  decorator  A decorator function, returning `Span`
   *
   * @return  {void}
   */
  public addDecorator<T extends Decorator>(decorator: T): void {
    this._hooks.decorators.push(decorator)
  }

  /**
   * Registers a span override to be applied every time a Span
   * is sent to the Push API
   *
   * @param   {Function}  override  An override function, returning `Span`
   *
   * @return  {void}
   */
  public addOverride<T extends Override>(override: T): void {
    this._hooks.overrides.push(override)
  }

  /**
   * Sends a demonstration error to AppSignal.
   *
   * @return  {void}
   */
  public demo(): void {
    const span = this._createSpanFromError(
      new Error(
        "Hello world! This is an error used for demonstration purposes."
      )
    )

    span
      .setAction("TestAction")
      .setParams({
        path: "/hello",
        method: "GET"
      })
      .setTags({
        demo_sample: "true"
      })

    this.send(span)
  }

  /**
   * Adds a breadcrumb.
   *
   * @param   {Breadcrumb}  breadcrumb  A valid breadcrumb
   *
   * @return  {void}
   */
  public addBreadcrumb(breadcrumb: Omit<Breadcrumb, "timestamp">): void {
    const crumb: Breadcrumb = {
      timestamp: Math.round(new Date().getTime() / 1000),
      ...breadcrumb,
      metadata: toHashMap(breadcrumb.metadata)
    }

    if (!crumb.category) {
      console.warn("[APPSIGNAL]: Breadcrumb not added. `category` is missing.")
      return
    }

    if (!crumb.action) {
      console.warn("[APPSIGNAL]: Breadcrumb not added. `action` is missing.")
      return
    }

    if (this._breadcrumbs.length === 20) {
      this._breadcrumbs.pop()
    }

    this._breadcrumbs.unshift(crumb)
  }

  /**
   * Creates a valid AppSignal `Span` from a JavaScript `Error`
   * object.
   *
   * @param   {Error}  error  A JavaScript error
   *
   * @return  {Span}         An AppSignal event
   */
  private _createSpanFromError(error: Error): Span {
    const event = this.createSpan()
    event.setError(error)

    return event
  }
}

// Returns a new `RegExp` object with the global flag removed.
// This fixes issues where using global regexes repeatedly with `test` against
// different strings will return unexpected results, due to the regex object
// storing the location of its last match and resuming the search from there.
function unglobalize(regexp: RegExp): RegExp {
  return new RegExp(regexp.source, regexp.flags.replace("g", ""))
}
