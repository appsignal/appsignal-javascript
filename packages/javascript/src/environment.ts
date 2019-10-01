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
    return (
      window.location.origin ||
      `${window.location.protocol}//${window.location.hostname}`
    )
  }

  /**
   * Returns the best currently available API that the current browser supports
   * for making HTTP requests.
   *
   * @return  {string}       The name of the best availble HTTP transport
   */
  public static transport(): string {
    if ((<any>window).XDomainRequest) {
      return "XDomainRequest"
    } else if ((<any>window).XMLHttpRequest && !window.fetch) {
      return "XMLHttpRequest"
    } else {
      return "fetch"
    }
  }

  /**
   * Indicates whether native promises are available in the current
   * browser or environment.
   *
   * Adapted from https://github.com/stefanpenner/es6-promise/blob/master/lib/es6-promise/polyfill.js
   *
   * @return  {boolean}       A value indicating if Promises are supported
   */
  public static supportsPromises(): boolean {
    let P = (<any>window).Promise

    if (P) {
      let promiseToString = null

      // checks for native promises
      try {
        promiseToString = Object.prototype.toString.call(P.resolve())
      } catch (e) {
        // silently ignored
      }

      if (promiseToString === "[object Promise]" && !P.cast) {
        return true
      }
    }

    return false
  }
}
