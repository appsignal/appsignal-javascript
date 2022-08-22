import type { JSClient } from "@appsignal/types"
import { isError } from "@appsignal/core"

function windowEventsPlugin(options?: { [key: string]: any }) {
  const ctx = window as Window

  const opts = {
    onerror: true,
    onunhandledrejection: true,
    ...options
  }

  return function (this: JSClient) {
    const self = this

    const prev = {
      onError: ctx.onerror,
      unhandledRejection: ctx.onunhandledrejection
    }

    function _onErrorHandler(
      this: WindowEventHandlers,
      event: Event | string,
      source?: string,
      lineno?: number,
      colno?: number,
      error?: Error
    ): void {
      const span = self.createSpan()

      // handles "Script error." message in some browsers when script is loaded
      // cross origin.
      // https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onerror#Notes
      if (
        typeof event === "string" &&
        lineno === 0 &&
        /Script error\.?/.test(event)
      ) {
        console.warn(
          "[APPSIGNAL]: Cross-domain or eval script error detected, error ignored"
        )
      } else {
        if (error) {
          span.setError(error)
        } else {
          // handle browsers that don't supply an `error` argument
          // or don't return a stacktrace
          span.setError({
            name: "Error",
            // `event` shoiuld be the message in most browsers
            message:
              typeof event === "string"
                ? event
                : 'An HTML onerror="" handler failed to execute',
            stack: `at ${source}:${lineno}${colno ? `:${colno}` : ""}`
          })
        }

        self.send(span)
      }

      if (typeof prev.onError === "function") {
        prev.onError.apply(this, arguments as any)
      }
    }

    function _onUnhandledRejectionHandler(
      this: WindowEventHandlers,
      event: PromiseRejectionEvent
    ): void {
      const span = self.createSpan()

      let error: Error

      if (event && event.reason && isError(event.reason)) {
        error = event.reason
      } else {
        error = {
          name: "UnhandledPromiseRejectionError",
          message: _reasonFromEvent(event)
        }
      }

      span.setError(error)

      self.send(span)

      if (typeof prev.unhandledRejection === "function") {
        prev.unhandledRejection.apply(this, arguments as any)
      }
    }

    if (opts.onerror) {
      ctx.onerror = _onErrorHandler
    }

    if (opts.onunhandledrejection) {
      ctx.onunhandledrejection = _onUnhandledRejectionHandler
    }
  }

  function _reasonFromEvent(event: PromiseRejectionEvent): string {
    if (!event || !event.reason) {
      return ""
    }

    if (typeof event.reason === "string") {
      return event.reason
    }

    return JSON.stringify(event.reason, circularReplacer())
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
}

export const plugin = windowEventsPlugin
