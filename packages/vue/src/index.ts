import { VueApp, VueViewModel } from "./types"
import type { JSClient } from "@appsignal/types"

export function errorHandler(appsignal: JSClient, app?: VueApp) {
  const version = app?.version ?? ""

  return function (error: Error, vm: VueViewModel, info: string) {
    const componentName = vm.$vnode
      ? vm.$vnode.componentOptions.tag // Vue 2
      : vm.$options.name // Vue 3
    const span = appsignal.createSpan()

    span
      .setAction(componentName || "[unknown Vue component]")
      .setTags({ framework: "Vue", info, version })
      .setError(error)

    appsignal.send(span)

    if (typeof console !== "undefined" && typeof console.error === "function") {
      console.error(error)
    }
  }
}
