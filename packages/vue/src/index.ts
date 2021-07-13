import { App, ComponentPublicInstance } from "vue"
import type { JSClient } from "@appsignal/types"

export function errorHandler(appsignal: JSClient, app?: App) {
  const version = app?.version ?? ""

  return function (
    error: unknown,
    instance: ComponentPublicInstance,
    info: string
  ) {
    let file
    if ("$vnode" in instance) {
      file = (instance as any).$vnode.componentOptions.tag
    } else {
      const path = instance.$options.__file

      // get filename from path
      if (path) file = path.substr(path.lastIndexOf("/") + 1)
    }

    const span = appsignal.createSpan()

    span
      .setAction(file || "[unknown Vue component]")
      .setTags({ framework: "Vue", info, version })
      .setError(error as Error)

    appsignal.send(span)

    if (typeof console !== "undefined" && typeof console.error === "function") {
      console.error(error)
    }
  }
}
