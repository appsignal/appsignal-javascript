import { Environment } from "./environment"
import { Event } from "./event"
import { urlEncode } from "./utils/url"

import { ITransport } from "./interfaces/ITransport"
import { XDomainTransport } from "./transports/xdomain"
import { XHRTransport } from "./transports/xhr"
import { FetchTransport } from "./transports/fetch"

import { PushApiOptions } from "./types/options"

export class PushApi {
  private _uri: string
  private _apiKey: string
  private _clientVersion: string
  private _transport: ITransport

  /**
   * Creates a new instance of the Push API client.
   *
   * @constructor
   *
   * @param   {object}  options  An object of options to configure the Push API client
   */
  constructor(options: PushApiOptions) {
    this._uri = options.uri || "https://appsignal-error-monitoring.net/collect"
    this._apiKey = options.key
    this._clientVersion = options.version

    this._transport = this._createTransport()
  }

  /**
   * Pushes a transaction to the Push API.
   *
   * @param   {Event}     event    A single API `Event`
   *
   * @return  {Promise<Event>}     A single API `Event`
   */
  public async push(event: Event): Promise<Event> {
    await this._transport.send(event.toJSON())
    return event
  }

  /**
   * Creates an instance of a new `Transport` object. A `Transport` is a
   * browser API that is able to sent HTTP requests to an endpoint. A
   * transport is selected based on the best available in the current
   * environment.
   *
   * @return  {ITransport}  A Transport object
   */
  private _createTransport(): ITransport {
    const url = this._url()

    switch (Environment.transport()) {
      case "XDomainRequest":
        return new XDomainTransport(url)
      case "XMLHttpRequest":
        return new XHRTransport(url)
      default:
        return new FetchTransport(url)
    }
  }

  /**
   * Constructs a complete URL for accessing the Push API.
   *
   * @return  {string}  A Push API URL string
   */
  private _url(): string {
    const auth = this._authorization()
    return `${this._uri}?${urlEncode(auth)}`
  }

  /**
   * Creates an object of API credentials.
   *
   * @return  {object}  API credentials
   */
  private _authorization(): object {
    return {
      api_key: this._apiKey,
      version: this._clientVersion
    }
  }
}
