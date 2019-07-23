import Appsignal from "@appsignal/javascript"
import { Span } from "@appsignal/javascript/src/span"
import { Application } from "stimulus"

export function installErrorHandler(
  appsignal: Appsignal,
  application: Application
) {
  const DEFAULT_ACTION = "Application.handleError"
  const prevHandler = application.handleError

  application.handleError = function(error: Error, message: string) {
    const span = appsignal.createSpan((span: Span) =>
      span
        .setAction(DEFAULT_ACTION)
        .setTags({ framework: "Stimulus", message })
        .setError(error)
    )

    appsignal.send(span)

    if (prevHandler && typeof prevHandler === "function") {
      prevHandler.apply(this, arguments as any)
    }
  }
}
