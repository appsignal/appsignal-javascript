import type Appsignal from "@appsignal/javascript"
import type { Span } from "@appsignal/javascript"

export function installErrorHandler(appsignal: Appsignal, application: any) {
  const prevHandler = application.handleError

  application.handleError = function (
    error: Error,
    message: string,
    detail: { identifier?: string }
  ) {
    const span = appsignal.createSpan((span: Span) =>
      span
        .setAction(detail?.identifier || "[unknown Stimulus controller]")
        .setTags({ framework: "Stimulus", message })
        .setError(error)
    )

    appsignal.send(span)

    if (prevHandler && typeof prevHandler === "function") {
      prevHandler.apply(this, arguments as any)
    }
  }
}
