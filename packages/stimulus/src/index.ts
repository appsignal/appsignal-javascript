export function installErrorHandler(appsignal: any, application: any) {
  const prevHandler = application.handleError

  application.handleError = function(error: Error, message: string) {
    const span = appsignal.createSpan((span: any) =>
      span.setTags({ framework: "Stimulus", message }).setError(error)
    )

    appsignal.send(span)

    if (prevHandler && typeof prevHandler === "function") {
      prevHandler.apply(this, arguments as any)
    }
  }
}
