import { Environment } from "./environment"
import { Span } from "./span"

import { XDomainTransport } from "./transports/xdomain"
import { XHRTransport } from "./transports/xhr"
import { FetchTransport } from "./transports/fetch"
import { NodeTransport } from "./transports/node"

import { PushApiOptions } from "./options"
import { Transport } from "./transport"

export class PushApi {
  private _uri: string
  private _apiKey: string
  private _clientVersion: string
  private _transport: Transport

  /**
   * Creates a new instance of the Push API client.
   *
   * @constructor
   *
   * @param   {object}  options  An object of options to configure the Push API client
   */
  constructor(options: PushApiOptions) {
    this._uri = options.uri || "https://appsignal-endpoint.net/collect"
    this._apiKey = options.key
    this._clientVersion = options.version

    this._transport = this._createTransport(this._url())
  }

  /**
   * Pushes a transaction to the Push API.
   *
   * @param   {Span}     span     A single API `Span`
   *
   * @return  {Promise<Span>}     A single API `Span`
   */
  public async push(span: Span): Promise<Span> {
    await this._transport.send(span.toJSON())
    return span
  }

  /**
   * Creates an instance of a new `Transport` object. A `Transport` is a
   * browser API that is able to sent HTTP requests to an endpoint. A
   * transport is selected based on the best available in the current
   * environment.
   *
   * @return  {ITransport}  A Transport object
   */
  private _createTransport(url: string): Transport {
    switch (Environment.transport()) {
      case "XDomainRequest":
        return new XDomainTransport(url)
      case "XMLHttpRequest":
        return new XHRTransport(url)
      case "NodeHTTP":
        return new NodeTransport(url)
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

/**
 * Encodes given object into url-friendly format
 *
 * @param   {object}  object:   [object: An object that contains serializable values]
 *
 * @return  {string}            [Encoded URI params]
 */
export function urlEncode(object: { [key: string]: any }): string {
  return Object.keys(object)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(object[key])}`)
    .join("&")
}
