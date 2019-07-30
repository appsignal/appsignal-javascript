export function errorHandler(appsignal: any, Vue?: any) {
  const { version = "unknown" } = Vue

  return function(error: Error, vm: any, info: string) {
    const { tag } = vm.$vnode.componentOptions
    const span = appsignal.createSpan()

    span
      .setAction(tag || undefined)
      .setTags({ framework: "Vue", info, version })
      .setError(error)

    appsignal.send(span)

    if (typeof console !== "undefined" && typeof console.error === "function") {
      console.error(error)
    }
  }
}
