import type { JSClient, Breadcrumb } from "@appsignal/types"

const SUPPORTED_CONSOLE_METHODS = ["log", "debug", "info", "warn", "error"]

function consoleBreadcrumbsPlugin(options?: { [key: string]: any }) {
  const CONSOLE_LOG_METHODS = SUPPORTED_CONSOLE_METHODS.filter(
    (method: string) =>
      typeof console !== "undefined" &&
      typeof (console as any)[method] === "function"
  )

  return function (this: JSClient) {
    const self = this

    CONSOLE_LOG_METHODS.forEach((method: string) => {
      const prevHandler = (console as any)[method]

      function _console(...args: any[]) {
        const breadcrumb: Omit<Breadcrumb, "timestamp"> = {
          action:
            args.length > 1
              ? "Console logged some values"
              : "Console logged a value",
          category: `console.${method}`,
          metadata: {}
        }

        args.forEach(
          (arg, i) =>
            // we're sure the `metadata` property exists
            (breadcrumb.metadata![`argument${i}`] =
              // attempt to get a useful value
              // the `metadata` object should be <string, string>, so nested
              // objects won't necessarily work here
              serializeValue(arg, method))
        )

        self.addBreadcrumb(breadcrumb)

        prevHandler.apply(console, args)
      }

      ;(console as any)[method] = _console
    })
  }
}

function serializeValue(value: any, method: string) {
  if (typeof value === "string") {
    return value
  } else {
    try {
      return JSON.stringify(value)
    } catch (error) {
      console.error(`Could not serialize "console.${method}" to String.`, error)
      return "[Value could not be serialized]"
    }
  }
}

export const plugin = consoleBreadcrumbsPlugin
