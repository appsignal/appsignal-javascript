import type Appsignal from "@appsignal/javascript"
import type { Span } from "@appsignal/javascript"

function pathDecoratorPlugin(options?: { [key: string]: any }) {
  return function (this: Appsignal) {
    const decorator = (span: Span) =>
      span.setTags({ path: window.location.pathname })

    this.addDecorator(decorator)
  }
}

export const plugin = pathDecoratorPlugin
