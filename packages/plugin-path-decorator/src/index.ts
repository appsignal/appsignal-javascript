function pathDecoratorPlugin(options?: { [key: string]: any }) {
  return function(this: any) {
    const decorator = (span: any) =>
      span.setTags({ path: window.location.pathname })

    this._hooks.decorators.push(decorator)
  }
}

export const plugin = pathDecoratorPlugin
