/**
 * The standard format for an error that is passed to AppSignal.
 */
export type SpanError = {
  name: string
  message?: string
  backtrace?: string[]
}

/**
 * Check if the given object is an error-like object.
 *
 * @param   {Error | T}     error      An `Error` object or an error-like object
 *
 * @return  {boolean}
 */
export function isError<T extends Error>(error: Error | T): boolean {
  return (
    typeof error === "object" && typeof (error as any).message !== "undefined"
  )
}

/**
 * Get backtrace from an `Error` object, or an error-like object
 *
 * @param   {Error | T}     error      An `Error` object or an error-like object
 *
 * @return  {string[]}                 A backtrace
 */
export function getStacktrace<T extends Error>(error: Error | T): string[] {
  if (
    typeof (error as any).stacktrace !== "undefined" ||
    typeof (error as any)["opera#sourceloc"] !== "undefined"
  ) {
    // probably opera
    const { stacktrace = "" } = error as any
    return stacktrace
      .split("\n")
      .filter((line: string | undefined) => line !== "")
  } else if (error.stack) {
    // an Error or a plain object that resembles an error
    const { stack = "" } = error
    return stack.split("\n").filter(line => line !== "")
  } else {
    // probably IE9 :(
    return ["No stacktrace available"]
  }
}
