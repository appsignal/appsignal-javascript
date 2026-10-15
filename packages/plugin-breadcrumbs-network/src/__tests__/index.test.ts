import type Appsignal from "@appsignal/javascript"
import { plugin, pluginBreadcrumbsNetwork } from "../index"

describe("networkBreadcrumbsPlugin exports", () => {
  const originalFetch = window.fetch

  afterEach(() => {
    window.fetch = originalFetch
  })

  it("preserves the plugin export as an alias", () => {
    expect(pluginBreadcrumbsNetwork).toBe(plugin)
  })

  it.each<[string, typeof plugin]>([
    ["plugin", plugin],
    ["pluginBreadcrumbsNetwork", pluginBreadcrumbsNetwork]
  ])("%s adds breadcrumbs for fetch responses", async (_name, factory) => {
    const response = { status: 200 } as Response
    const fetchMock = jest.fn().mockResolvedValue(response)
    window.fetch = fetchMock

    const addBreadcrumb = jest.fn()
    const appsignal = ({ addBreadcrumb } as unknown) as Appsignal
    factory({ xhrEnabled: false }).call(appsignal)

    const result = await window.fetch("/example", { method: "POST" })

    expect(result).toBe(response)
    expect(fetchMock).toHaveBeenCalledWith("/example", { method: "POST" })
    expect(addBreadcrumb).toHaveBeenCalledWith({
      action: "Received a response with code 200",
      category: "Fetch",
      metadata: { method: "POST", url: "/example" }
    })
  })
})
