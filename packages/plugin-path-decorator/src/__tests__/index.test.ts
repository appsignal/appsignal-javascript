import type Appsignal from "@appsignal/javascript"
import type { Span } from "@appsignal/javascript"
import { plugin, pluginPathDecorator } from "../index"

describe("pathDecoratorPlugin exports", () => {
  it("preserves the plugin export as an alias", () => {
    expect(pluginPathDecorator).toBe(plugin)
  })

  it.each<[string, typeof plugin]>([
    ["plugin", plugin],
    ["pluginPathDecorator", pluginPathDecorator]
  ])("%s adds the current path to spans", (_name, factory) => {
    const addDecorator = jest.fn()
    const appsignal = ({ addDecorator } as unknown) as Appsignal
    factory().call(appsignal)

    expect(addDecorator).toHaveBeenCalledTimes(1)

    const setTags = jest.fn()
    const span = ({ setTags } as unknown) as Span
    const decorator = addDecorator.mock.calls[0][0]
    decorator(span)

    expect(setTags).toHaveBeenCalledWith({ path: window.location.pathname })
  })
})
