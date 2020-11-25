import type { JSClient } from "@appsignal/types"

type PluginOptions = {
  // A boolean value representing whether the plugin should bind to `XMLHttpRequest`
  xhrEnabled: boolean
  // A boolean value representing whether the plugin should bind to `fetch`
  fetchEnabled: boolean
  // If any of the patterns match a request URL, then that request is ignored
  // Caution: don't add too many `RegExp`s to this array, otherwise network requests
  // will become very slow.
  ignoreUrls: RegExp[]
}

// Default options
const DEFAULTS = {
  xhrEnabled: true,
  fetchEnabled: true,
  ignoreUrls: []
}

/**
 * Automatically adds a breadcrumb on every network request.
 */
function networkBreadcrumbsPlugin(options?: Partial<PluginOptions>) {
  const opts = { ...DEFAULTS, ...options }
  const { xhrEnabled, fetchEnabled, ignoreUrls } = opts

  // feature detect browser features if they are enabled
  const isXhrEnabled = xhrEnabled ? "XMLHttpRequest" in window : false
  const isFetchEnabled = fetchEnabled ? "fetch" in window : false

  return function (this: JSClient): void {
    const appsignal = this

    const xhrPatch = () => {
      const prevOpen = XMLHttpRequest.prototype.open

      // per the spec, this could be caled with more arguments,
      // but we just need `method` and `url` here. the rest are
      // passed to `prevOpen` later.
      function open(this: XMLHttpRequest, method: string, url: string): void {
        const metadata = { method, url }

        function onXhrLoad(this: XMLHttpRequest) {
          if (!ignoreUrls.some(el => el.test(url))) {
            appsignal.addBreadcrumb({
              action:
                this.status >= 400
                  ? `Request failed with code ${this.status}`
                  : `Received a response with code ${this.status}`,
              category: "XMLHttpRequest",
              metadata
            })
          }
        }

        function onXhrError(this: XMLHttpRequest) {
          if (!ignoreUrls.some(el => el.test(url))) {
            appsignal.addBreadcrumb({
              action: "Request failed",
              category: "XMLHttpRequest",
              metadata
            })
          }
        }

        // set handlers
        this.addEventListener("load", onXhrLoad)
        this.addEventListener("error", onXhrError)

        prevOpen.apply(this, arguments as any)
      }

      XMLHttpRequest.prototype.open = open
    }

    const fetchPatch = () => {
      const originalFetch = window.fetch

      function fetch(
        input: RequestInfo,
        init?: RequestInit
      ): Promise<Response> {
        const url = typeof input === "string" ? input : input.url

        // Assume a GET request if we can't infer the method
        const method =
          (typeof input !== "string" && input.method) ||
          (init && init.method) ||
          "GET"

        const metadata = {
          method,
          url
        }

        if (ignoreUrls.some(el => el.test(url))) {
          return originalFetch.apply(window, arguments as any)
        }

        return originalFetch
          .apply(window, arguments as any)
          .then((response: Response) => {
            // re-assign to fix some browsers not liking when you
            // access `response.status` directly
            const { status: statusCode } = response

            appsignal.addBreadcrumb({
              action: `Received a response with code ${statusCode}`,
              category: "Fetch",
              metadata
            })

            return response
          })
          .catch((error: Error) => {
            appsignal.addBreadcrumb({
              action: "Request failed",
              category: "Fetch",
              metadata
            })

            throw error
          })
      }

      window.fetch = fetch
    }

    if (isXhrEnabled) xhrPatch()
    if (isFetchEnabled) fetchPatch()
  }
}

export const plugin = networkBreadcrumbsPlugin
