/**
 * Checks whether we're in the Node.js or Browser environment
 *
 * Originally from https://github.com/getsentry/sentry-javascript/
 */

export function isNodeEnv(): boolean {
  return (
    Object.prototype.toString.call(
      typeof process !== "undefined" ? process : 0
    ) === "[object process]"
  )
}

/**
 * Safely get global scope object
 *
 * Originally from https://github.com/getsentry/sentry-javascript/
 */
export function getGlobalObject<T>(): T {
  return (isNodeEnv()
    ? global
    : typeof window !== "undefined"
    ? window
    : typeof self !== "undefined"
    ? self
    : {}) as T
}
