import { JSClient } from "@appsignal/types"
import Vue, { VueConstructor } from "vue"

export function errorHandler(appsignal: JSClient, Vue?: VueConstructor<Vue>) {
  const version = Vue?.version ?? ""

  return function (error: Error, vm: Vue, info: string) {
    const { componentOptions } = vm.$vnode
    const span = appsignal.createSpan()

    span
      .setAction(componentOptions?.tag || "[unknown Vue component]")
      .setTags({ framework: "Vue", info, version })
      .setError(error)

    appsignal.send(span)

    if (typeof console !== "undefined" && typeof console.error === "function") {
      console.error(error)
    }
  }
}
