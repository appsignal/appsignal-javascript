import { Component } from "preact"
import { Props, State } from "./types/component"
import { isError } from "@appsignal/core"

export class ErrorBoundary extends Component<Props, State> {
  state = { error: undefined }

  static defaultProps = {
    action: ""
  }

  public componentDidCatch(error: Error, info: any): void {
    if (!isError(error)) return

    const { instance: appsignal, action, tags } = this.props
    const { name, message, stack } = error
    const span = appsignal.createSpan()

    span
      .setError({
        name,
        message,
        stack
      })
      .setTags({ framework: "Preact", ...tags })

    if (action && action !== "") span.setAction(action)

    appsignal.send(span)

    this.setState({ error })
  }

  public render() {
    if (this.state.error) {
      return this.props.fallback ? this.props.fallback(this.state.error) : null
    }

    return this.props.children
  }
}
