/**
 * The AppSignal client.
 * @module Appsignal
 */

import { VERSION } from "./version"
import { PushApi } from "./api"
import { Environment } from "./environment"
import { Span } from "./span"
import { compose } from "./utils/functional"
import { Queue } from "./queue"
import { Dispatcher } from "./dispatcher"

import { IHook } from "./interfaces/IHook"
import { AppsignalOptions } from "./types/options"
import { Breadcrumb } from "@appsignal/types"
import { toHashMap } from "./utils/hashmap"

export default class Appsignal {
  public VERSION = VERSION

  private _dispatcher: Dispatcher
  private _options: AppsignalOptions
  private _api: PushApi
  private _breadcrumbs: Breadcrumb[]

  private _hooks = {
    decorators: Array<IHook>(),
    overrides: Array<IHook>()
  }

  private _env = Environment.serialize()
  private _queue = new Queue((window as any).__APPSIGNAL_QUEUE__ || [])

  /**
   * Creates a new instance of the AppSignal client.
   *
   * @constructor
   *
   * @param   {AppsignalOptions}  options        An object of options to configure the AppSignal client
   */
  constructor(options: AppsignalOptions) {
    const { key, uri, revision } = options

    if (revision && typeof revision !== "string") {
      options.revision = String(revision)
    }

    this._api = new PushApi({
      key,
      uri,
      version: this.VERSION
    })

    this._breadcrumbs = []
    this._dispatcher = new Dispatcher(this._queue, this._api)

    this._options = options
  }

  /**
   * Records and sends a browser `Error` to AppSignal.
   *
   * @param   {Error}             error          A JavaScript Error object
   * @param   {object}            tags           An key, value object of tags
   * @param   {string}            namespace      An optional namespace name
   *
   * @return  {Promise<Span> | void}             An API response, or `void` if `Promise` is unsupported.
   */
  public send(
    error: Error,
    tags?: object,
    namespace?: string
  ): Promise<Span> | void

  /**
   * Records and sends an Appsignal `Span` object to AppSignal.
   *
   * @param   {Error}             error          A JavaScript Error object
   *
   * @return  {Promise<Span>}                    An API response, or `void` if `Promise` is unsupported.
   */
  public send(span: Span): Promise<Span> | void

  /**
   *
   * @param   {Error | Span}      data           A JavaScript Error or Appsignal Span object
   * @param   {object}            tags           An key, value object of tags
   * @param   {string}            namespace      An optional namespace name
   *
   * @return  {Promise<Span> | void}             An API response, or `void` if `Promise` is unsupported.
   */
  public send(
    data: Error | Span,
    tags = {},
    namespace?: string
  ): Promise<any> | void {
    if (!(data instanceof Error) && !(data instanceof Span)) {
      // @TODO: route this through a central logger
      console.error(
        "[APPSIGNAL]: Can't send error, given error is not a valid type"
      )
      return
    }

    // a "span" currently refers to a fixed point in time, as opposed to
    // a range or length in time. this may change in future!
    const span = data instanceof Span ? data : this._createSpanFromError(data)

    // A Span can be "decorated" with metadata after it has been created,
    // but before it is sent to the API and before metadata provided
    // as arguments is added
    if (this._hooks.decorators.length > 0) {
      compose(...this._hooks.decorators)(span)
    }

    if (tags) span.setTags(tags)
    if (namespace) span.setNamespace(namespace)
    if (this._breadcrumbs.length > 0) span.setBreadcrumbs(this._breadcrumbs)

    // A Span can be "overridden" with metadata after it has been created,
    // but before it is sent to the API and after metadata provided
    // as arguments is added
    if (this._hooks.overrides.length > 0) {
      compose(...this._hooks.overrides)(span)
    }

    if (Environment.supportsPromises()) {
      return this._api.push(span).catch(() => {
        this._queue.push(span)

        // schedule on next tick
        setTimeout(() => this._dispatcher.schedule(), 0)
      })
    } else {
      // @TODO: route this through a central logger
      console.error(
        "[APPSIGNAL]: Error not sent. A Promise polyfill is required."
      )
      return
    }
  }

  /**
   * Records and sends a browser `Error` to AppSignal. An alias to `#send()`
   * to maintain compatibility.
   *
   * @param   {Error}             error          A JavaScript Error object
   * @param   {object}            tags           An key, value object of tags
   * @param   {string}            namespace      An optional namespace name
   *
   * @return  {Promise<Span> | void}             An API response, or `void` if `Promise` is unsupported.
   */
  public sendError(
    error: Error,
    tags?: object,
    namespace?: string
  ): Promise<Span> | void {
    return this.send(error, tags, namespace)
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
  public createSpan(fn?: Function): Span {
    const { revision = "" } = this._options

    const span = new Span({
      environment: this._env,
      revision
    })

    if (fn && typeof fn === "function") fn(span)

    return span
  }

  /**
   * Wraps and catches errors within a given function
   *
   * @param   {Function}          fn             [fn description]
   *
   * @return  {Promise<any>}      A Promise containing the return value of the function, or a `Span` if an error was thrown.
   */
  public async wrap(fn: Function): Promise<any> {
    try {
      return Promise.resolve(fn())
    } catch (e) {
      await this.sendError(e)
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
  public addDecorator<T extends IHook>(decorator: T): void {
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
  public addOverride<T extends IHook>(override: T): void {
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
