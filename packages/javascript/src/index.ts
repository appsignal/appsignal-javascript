/**
 * The AppSignal client.
 * @module Appsignal
 */

import { PushApi } from "./api"
import { Environment } from "./environment"
import { Event } from "./event"

import { AppsignalOptions } from "./types/options"

export default class Appsignal {
  public VERSION = "1.0.0"

  private _env = Environment.serialize()
  private _options: AppsignalOptions
  private _api: PushApi

  /**
   * Creates a new instance of the AppSignal client.
   *
   * @constructor
   *
   * @param   {AppsignalOptions}  options        An object of options to configure the AppSignal client
   */
  constructor(options: AppsignalOptions) {
    const { key, uri } = options

    this._api = new PushApi({
      key,
      uri,
      version: this.VERSION
    })

    this._options = options
  }

  /**
   * Records and sends a browser `Error` to AppSignal.
   *
   * @param   {Error}             error          A JavaScript Error object
   * @param   {object}            tags           An key, value object of tags
   * @param   {string}            namespace      An optional namespace name
   *
   * @return  {Promise<Event> | void}            An API response, or `void` if `Promise` is unsupported.
   */
  public send(
    error: Error,
    tags?: object,
    namespace?: string
  ): Promise<Event> | void

  /**
   * Records and sends an Appsignal `Event` object to AppSignal.
   *
   * @param   {Error}             error          A JavaScript Error object
   *
   * @return  {Promise<Event>}                   An API response, or `void` if `Promise` is unsupported.
   */
  public send(event: Event): Promise<Event> | void

  /**
   *
   * @param   {Error | Event}     data           A JavaScript Error or Appsignal Event object
   * @param   {object}            tags           An key, value object of tags
   * @param   {string}            namespace      An optional namespace name
   *
   * @return  {Promise<Event> | void}            An API response, or `void` if `Promise` is unsupported.
   */
  public send(
    data: Error | Event,
    tags = {},
    namespace?: string
  ): Promise<any> | void {
    if (!(data instanceof Error) && !(data instanceof Event)) {
      throw new Error("Can't send error, given error is not a valid type")
    }

    // "events" refer to a fixed point in time, as opposed to
    // a range or length in time
    const event =
      data instanceof Event ? data : this._createEventFromError(data)

    if (tags) event.setTags(tags)
    if (namespace) event.setNamespace(namespace)

    if (Environment.supportsPromises()) {
      return this._api.push(event)
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
   * @return  {Promise<Event> | void}            An API response, or `void` if `Promise` is unsupported.
   */
  public sendError(
    error: Error,
    tags?: object,
    namespace?: string
  ): Promise<Event> | void {
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
   * @param   {object}            options        An options object
   *
   * @return  {void}
   */
  public use(plugin: Function, options?: { [key: string]: any }): void {
    plugin(options).call(this)
  }

  /**
   * Creates a new `Event`, augmented with the current environment.
   *
   * @return  {Event}             An AppSignal `Event` object
   */
  public createEvent(): Event {
    return new Event({ environment: this._env })
  }

  /**
   * Returns an object that includes useful diagnostic information.
   * Can be used to debug the installation.
   *
   * @return  {object}            A diagnostic report
   */
  public diagnose(): object {
    return {
      version: this.VERSION,
      config: this._options,
      environment: this._env
    }
  }

  /**
   * Creates a valid AppSignal `Event` from a JavaScript `Error`
   * object.
   *
   * @param   {Error}  error  A JavaScript error
   *
   * @return  {Event}         An AppSignal event
   */
  private _createEventFromError(error: Error): Event {
    const event = this.createEvent()
    event.setError(error)

    return event
  }
}
