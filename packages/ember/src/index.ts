import type { JSClient, JSSpan } from "@appsignal/types"

export function installErrorHandler(
  appsignal: JSClient,
  Ember = (window as any).Ember
) {
  const prevHandler = Ember.onerror

  if (!Ember) {
    console.warn("[APPSIGNAL]: No instance of Ember found.")
    return
  }

  Ember.onerror = function (error: Error): void {
    const span = appsignal.createSpan((span: JSSpan) => span.setError(error))

    appsignal.send(span)

    if (prevHandler && typeof prevHandler === "function") {
      prevHandler.apply(this, arguments as any)
    } else if (Ember.testing) {
      throw error
    }
  }

  // fired when ember's internal promise implementation throws an unhandled exception
  Ember.RSVP.on("error", function (reason: any): void {
    const span = appsignal.createSpan()

    if (reason instanceof Error) {
      span.setError(reason)
    } else {
      // we set the name to "UnhandledPromiseRejectionError", to keep it consistent with
      // the errors from the window.onunhandledrejection handler
      span.setError({
        name: "UnhandledPromiseRejectionError",
        message: typeof reason === "string" ? reason : JSON.stringify(reason),
        stack: ""
      })
    }

    appsignal.send(span)
  })
}
