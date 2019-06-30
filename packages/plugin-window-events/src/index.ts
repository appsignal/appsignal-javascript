function windowEventsPlugin(options?: any) {
  const ctx = window as Window

  const opts = {
    onerror: true,
    onunhandledrejection: true,
    ...options
  }

  return function(this: any) {
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
      const ev = self.createEvent()

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
        ev.setAction("window.onerror")

        if (error) {
          ev.setError(error)
        } else {
          // handle browsers that don't supply an `error` argument
          // or don't return a stacktrace
          ev.setError({
            name: "Error",
            message: event,
            stack: `at ${source}:${lineno}${colno ? `:${colno}` : ""}`
          })
        }

        self.send(ev)
      }

      if (typeof prev.onError === "function") {
        prev.onError.apply(this, arguments as any)
      }
    }

    function _onUnhandledRejectionHandler(
      this: WindowEventHandlers,
      error: PromiseRejectionEvent
    ): void {
      const ev = self.createEvent()

      ev.setAction("window.onunhandledrejection")

      ev.setError({
        name: "UnhandledPromiseRejectionError",
        message:
          typeof error.reason === "string"
            ? error.reason
            : JSON.stringify(error.reason),
        // if `reason` is an instance of `Error`, then it may contain
        // a stack. we try to get it here, or just return an empty string
        stack: error.reason.stack || ""
      })

      self.send(ev)

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
}

export const plugin = windowEventsPlugin
