import * as React from "react"
import { Props, State } from "./types/component"

const DEFAULT_ACTION = "ErrorBoundary"

export class ErrorBoundary extends React.Component<Props, State> {
  state = { hasError: false }

  static defaultProps = {
    action: DEFAULT_ACTION
  }

  static getDerivedStateFromError(error: any): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  componentDidCatch(error: any, info: any): void {
    const { instance: appsignal, action } = this.props
    const { name, message, stack } = error
    const span = appsignal.createSpan()

    span.setAction(action !== "" ? action : DEFAULT_ACTION)

    span.setError({
      name,
      message,
      stack
    })

    span.setTags({ framework: "React" })

    appsignal.send(span)
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return this.props.fallback ? this.props.fallback() : null
    }

    return this.props.children
  }
}
