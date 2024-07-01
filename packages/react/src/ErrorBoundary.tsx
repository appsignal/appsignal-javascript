import React from "react"
import { Props, State } from "./types/component"

export class ErrorBoundary extends React.Component<Props, State> {
  state = { error: undefined }

  static defaultProps = {
    action: ""
  }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  public componentDidCatch(error: Error): void {
    const { instance: appsignal, action, tags = {}, override } = this.props
    let span = appsignal.createSpan()

    span.setError(error).setTags({ framework: "React", ...tags })

    if (action && action !== "") span.setAction(action)

    if (override) {
      span = override(span, error)
    }

    appsignal.send(span)

    // fall back if getDerivedStateFromError wasn't called before
    // componentDidCatch. fixes support for react 16 - 16.6.
    if (!this.state.error) this.setState({ error })
  }

  public render(): React.ReactNode {
    if (this.state.error) {
      return this.props.fallback ? this.props.fallback(this.state.error) : null
    }

    return this.props.children
  }
}
