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
    // We check for React Native here. React Native and Expo do
    // not have an origin per se, so we handle that case.
    if (navigator.product === "ReactNative" && !window.location) {
      return ""
    }

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
   * Indicates whether promises are available in the current browser
   * or environment.
   *
   * Adapted from https://github.com/Modernizr/Modernizr/blob/master/feature-detects/es6/promises.js
   *
   * @return  {boolean}       A value indicating if Promises are supported
   */
  public static supportsPromises(): boolean {
    return (
      "Promise" in window &&
      // Some of these methods are missing from
      // Firefox/Chrome experimental implementations
      "resolve" in window.Promise &&
      "reject" in window.Promise &&
      "all" in window.Promise &&
      "race" in window.Promise &&
      // Older version of the spec had a resolver object
      // as the arg rather than a function
      (function() {
        var resolve
        new window.Promise(function(r) {
          resolve = r
        })
        return typeof resolve === "function"
      })()
    )
  }
}
