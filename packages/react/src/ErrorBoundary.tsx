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

  public componentDidCatch(error: Error, info: any): void {
    const { instance: appsignal, action } = this.props
    const { name, message, stack } = error
    const span = appsignal.createSpan()

    span
      .setAction(action !== "" ? action : undefined)
      .setError({
        name,
        message,
        stack
      })
      .setTags({ framework: "React" })

    appsignal.send(span)
  }

  public render(): React.ReactNode {
    if (this.state.error) {
      return this.props.fallback ? this.props.fallback(this.state.error) : null
    }

    return this.props.children
  }
}
