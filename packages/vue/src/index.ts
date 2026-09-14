import { VueApp } from "./types"
import type Appsignal from "@appsignal/javascript"

function componentName(vm: any): string | undefined {
  if (vm?.$vnode) {
    return vm.$vnode.componentOptions.tag // Vue 2
  }

  // `__file` comes from vue-loader: always in development, in production
  // only as a basename and only when the app enables its `exposeFilename` option.
  const options = vm?.$options
  if (!options) return undefined

  const file = options.__file
    ?.split("/")
    .pop()
    ?.replace(/\.vue$/, "")

  return options.name || options.__name || file
}

export function errorHandler(appsignal: Appsignal, app?: VueApp) {
  const version = app?.version ?? ""

  // Vue 3 invokes the handler with a null `vm` for errors raised outside a
  // component context, so nothing here may assume a component instance.
  return function (error: any, vm: any, info: string) {
    const span = appsignal.createSpan()

    span
      .setAction(componentName(vm) || "[unknown Vue component]")
      .setTags({ framework: "Vue", info, version })
      .setError(error)

    appsignal.send(span)

    if (typeof console !== "undefined" && typeof console.error === "function") {
      console.error(error)
    }
  }
}
