import type Appsignal from "@appsignal/javascript"
import type { Breadcrumb } from "@appsignal/javascript"

const SUPPORTED_CONSOLE_METHODS = ["log", "debug", "info", "warn", "error"]

function consoleBreadcrumbsPlugin(options?: { [key: string]: any }) {
  const CONSOLE_LOG_METHODS = SUPPORTED_CONSOLE_METHODS.filter(
    (method: string) =>
      typeof console !== "undefined" &&
      typeof (console as any)[method] === "function"
  )

  return function (this: Appsignal) {
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
  switch (typeof value) {
    case "string":
      return value
    case "undefined":
      return "undefined"
    default:
      try {
        return JSON.stringify(value, circularReplacer())
      } catch (e) {
        // Stringifying the value may cause a RangeError when the reason
        // is a very large object.
        if (e && typeof (e as any).message === "string") {
          return `[could not stringify value: ${(e as any).message}]`
        }
        return "[could not stringify value]"
      }
  }
}

function circularReplacer() {
  const seenValue: any[] = []
  const seenKey: string[] = []
  return (key: string, value: any) => {
    if (typeof value === "object" && value !== null) {
      const i = seenValue.indexOf(value)
      if (i !== -1) {
        return `[cyclic value: ${seenKey[i] || "root object"}]`
      } else {
        seenValue.push(value)
        seenKey.push(key)
      }
    }

    return value
  }
}

export const plugin = consoleBreadcrumbsPlugin
