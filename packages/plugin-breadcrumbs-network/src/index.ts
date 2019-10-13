/**
 *
 * @param options
 */
function networkBreadcrumbsPlugin(options?: { [key: string]: any }) {
  const opts = {
    xhrEnabled: true,
    fetchEnabled: true,
    ...options
  }

  // feature detect browser features if they are enabled
  opts.xhrEnabled = opts.xhrEnabled ? "XMLHttpRequest" in window : false
  opts.fetchEnabled = opts.xhrEnabled ? "fetch" in window : false

  return function(this: any): void {
    const xhrPatch = () => {
      const appsignal = this
      const prevOpen = XMLHttpRequest.prototype.open

      // per the spec, this could be caled with more arguments,
      // but we just need `method` and `url` here. the rest are
      // passed to `prevOpen` later.
      function open(this: any, method: string, url: string): void {
        const metadata = { method, url }

        function onXhrLoad(this: XMLHttpRequest) {
          appsignal.addBreadcrumb({
            category:
              this.status >= 400
                ? `Request failed with code ${this.status}`
                : `Recieved a response with code ${this.status}`,
            action: "XMLHttpRequest",
            metadata
          })
        }

        function onXhrError(this: XMLHttpRequest) {
          appsignal.addBreadcrumb({
            category: "Request failed",
            action: "XMLHttpRequest",
            metadata
          })
        }

        // set handlers
        this.addEventListener("load", onXhrLoad)
        this.addEventListener("error", onXhrError)

        prevOpen.apply(this, arguments as any)
      }

      XMLHttpRequest.prototype.open = open
    }

    const fetchPatch = () => {
      const appsignal = this
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

        return originalFetch
          .apply(window, arguments as any)
          .then((response: Response) => {
            // re-assign to fix some browsers not liking when you
            // access `response.status` directly
            const { status: statusCode } = response

            appsignal.addBreadcrumb({
              category: `Recieved a response with code ${statusCode}`,
              action: "Fetch",
              metadata
            })

            return response
          })
          .catch((error: Error) => {
            appsignal.addBreadcrumb({
              category: "Request failed",
              action: "Fetch",
              metadata
            })

            throw error
          })
      }

      window.fetch = fetch
    }

    if (opts.xhrEnabled) xhrPatch()
    if (opts.fetchEnabled) fetchPatch()
  }
}

export const plugin = networkBreadcrumbsPlugin
