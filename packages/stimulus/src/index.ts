import type { JSClient, JSSpan } from "@appsignal/types"

export function installErrorHandler(appsignal: JSClient, application: any) {
  const prevHandler = application.handleError

  application.handleError = function (error: Error, message: string) {
    const span = appsignal.createSpan((span: JSSpan) =>
      span.setTags({ framework: "Stimulus", message }).setError(error)
    )

    appsignal.send(span)

    if (prevHandler && typeof prevHandler === "function") {
      prevHandler.apply(this, arguments as any)
    }
  }
}
