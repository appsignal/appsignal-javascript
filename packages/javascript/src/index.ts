/**
 * The AppSignal client.
 * @module Appsignal
 */

import { PushApi } from "./api"
import { Environment } from "./environment"
import { Transaction } from "./transaction"

import { AppsignalOptions } from "./types/options"

export default class Appsignal {
  public VERSION = "1.0.0"

  private _action = ""
  private _env = Environment.serialize()
  private _options: AppsignalOptions
  private _api: PushApi

  /**
   * Creates a new instance of the AppSignal client.
   *
   * @constructor
   *
   * @param   {AppsignalOptions}  options  An object of options to configure the AppSignal client
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

  public setAction(name: string) {
    this._action = name
  }

  /**
   * Records and sends an exception to AppSignal.
   *
   * @param   {Error}         error  A JavaScript Error object
   *
   * @return  {Promise<any>}         An API response
   */
  public sendError(
    error: Error,
    tags = {},
    namespace?: string
  ): Promise<any> | void {
    const txn = new Transaction({
      action: this._action,
      environment: this._env
    })

    if (!(error instanceof Error)) {
      throw new Error(
        "Can't send error, given error is not a valid Error object"
      )
    }

    txn.setError(error)

    if (tags) txn.setTags(tags)
    if (namespace) txn.setNamespace(namespace)

    if (Environment.supportsPromises()) {
      return this._api.push(txn)
    } else {
      // @TODO: route this through a central logger
      console.error(
        "[APPSIGNAL]: Error not sent. A Promise polyfill is required."
      )
      return
    }
  }

  /**
   * Returns an object that includes useful diagnostic information.
   * Can be used to debug the installation.
   *
   * @return  {object}  A diagnostic report
   */
  public diagnose(): object {
    return {
      version: this.VERSION,
      config: this._options,
      environment: this._env
    }
  }
}
