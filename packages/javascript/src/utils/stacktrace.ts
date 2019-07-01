import ErrorStackParser from "error-stack-parser"

/**
 * Get backtrace from an `Error` object, or an error-like object
 *
 * @param   {Error | T}     error      An `Error` object or an error-like object
 *
 * @return  {string[]}                 A backtrace
 */
export function getStacktrace<T extends Error>(error: Error | T): string[] {
  if (error instanceof Error) {
    try {
      const frames = ErrorStackParser.parse(error)
      return frames.map(f => f.source || "")
    } catch (e) {
      // probably IE9 or another browser where we can't get a stack
      return ["No stacktrace available"]
    }
  } else {
    // a plain object that resembles an error
    const { stack = "" } = error
    return stack.split("\n").filter(line => line !== "")
  }
}
