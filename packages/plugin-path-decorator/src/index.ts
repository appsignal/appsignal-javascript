import type { JSClient, JSSpan } from "@appsignal/types"

function pathDecoratorPlugin(options?: { [key: string]: any }) {
  return function (this: JSClient) {
    const decorator = (span: JSSpan) =>
      span.setTags({ path: window.location.pathname })

    this.addDecorator(decorator)
  }
}

export const plugin = pathDecoratorPlugin
