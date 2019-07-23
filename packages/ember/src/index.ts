export function installErrorHandler(
  appsignal: any,
  Ember = (window as any).Ember
) {
  const prevHandler = Ember.onerror

  if (!Ember) {
    console.warn("[APPSIGNAL]: No instance of Ember found.")
    return
  }

  Ember.onerror = function(error: Error): void {
    const span = appsignal.createSpan((span: any) =>
      span.setAction("Ember.onerror").setError(error)
    )

    appsignal.send(span)

    if (prevHandler && typeof prevHandler === "function") {
      prevHandler.apply(this, arguments as any)
    } else if (Ember.testing) {
      throw error
    }
  }

  Ember.RSVP.on("error", function(reason: any): void {
    const span = appsignal.createSpan((span: any) =>
      span.setAction("Ember.RSVP.on")
    )

    if (reason instanceof Error) {
      span.setError(reason)
    } else {
      span.setError({
        name: "UnhandledPromiseRejectionError",
        message: typeof reason === "string" ? reason : JSON.stringify(reason),
        stack: ""
      })
    }

    appsignal.send(span)
  })
}
