import { VueApp } from "./types"
import type Appsignal from "@appsignal/javascript"

export function errorHandler(appsignal: Appsignal, app?: VueApp) {
  const version = app?.version ?? ""

  return function (error: any, vm: any, info: string) {
    const componentName = vm.$vnode
      ? vm.$vnode.componentOptions.tag // Vue 2
      : vm.$options.name || vm.$options.__name // Vue 3
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
