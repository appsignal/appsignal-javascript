import { Component } from "preact"
import { Props, State } from "./types/component"

const DEFAULT_ACTION = "ErrorBoundary"

export class ErrorBoundary extends Component<Props, State> {
  state = { error: undefined }

  static defaultProps = {
    action: DEFAULT_ACTION
  }

  public componentDidCatch(error: Error, info: any): void {
    const { instance: appsignal, action, tags } = this.props
    const { name, message, stack } = error
    const span = appsignal.createSpan()

    span
      .setAction(action !== "" ? action : DEFAULT_ACTION)
      .setError({
        name,
        message,
        stack
      })
      .setTags({ framework: "Preact", ...tags })

    appsignal.send(span)

    this.setState({ error })
  }

  public render(): React.ReactNode {
    if (this.state.error) {
      return this.props.fallback ? this.props.fallback(this.state.error) : null
    }

    return this.props.children
  }
}
