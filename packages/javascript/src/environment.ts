import { getGlobalObject, isNodeEnv } from "@appsignal/core"

export class Environment {
  /**
   * Serializes the current browser environment into an object.
   */
  public static serialize(): { [key: string]: string } {
    return {
      transport: this.transport(),
      origin: this.origin()
    }
  }

  /**
   * Returns the origin of the current context.
   *
   * @return  {string}       The origin URL
   */
  public static origin(): string {
    const globals = getGlobalObject<Window>()

    // environments like nodejs or react native where an origin isn't relavent
    if (
      !globals.navigator ||
      (globals.navigator.product === "ReactNative" && !globals.location)
    ) {
      return ""
    }

    return (
      globals.location.origin ||
      `${globals.location.protocol}//${globals.location.hostname}`
    )
  }

  /**
   * Returns the best currently available API that the current browser supports
   * for making HTTP requests.
   *
   * @return  {string}       The name of the best availble HTTP transport
   */
  public static transport(): string {
    // we throw out the typechecking here as the transports aren't exported
    // using TS' `Window` type
    const globals = getGlobalObject<Window>() as any

    if (isNodeEnv()) {
      return "NodeHTTP"
    } else if (globals.XDomainRequest) {
      return "XDomainRequest"
    } else if (globals.XMLHttpRequest && !globals.fetch) {
      return "XMLHttpRequest"
    } else {
      return "fetch"
    }
  }

  /**
   * Indicates whether promises are available in the current browser
   * or environment.
   *
   * Adapted from https://github.com/Modernizr/Modernizr/blob/master/feature-detects/es6/promises.js
   *
   * @return  {boolean}       A value indicating if Promises are supported
   */
  public static supportsPromises(): boolean {
    // we throw out the typechecking here as the transports aren't exported
    // using TS' `Window` type
    const globals = getGlobalObject<Window>() as any

    return (
      "Promise" in globals &&
      // Some of these methods are missing from
      // Firefox/Chrome experimental implementations
      "resolve" in globals.Promise &&
      "reject" in globals.Promise &&
      "all" in globals.Promise &&
      "race" in globals.Promise &&
      // Older version of the spec had a resolver object
      // as the arg rather than a function
      (function () {
        var resolve
        new globals.Promise(function (r: any) {
          resolve = r
        })
        return typeof resolve === "function"
      })()
    )
  }
}
