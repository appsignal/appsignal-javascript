import * as React from "react"

type Props = {
  instance: any
  action: string
  children: React.ReactNode
  fallback: Function
}

type State = {
  hasError: boolean
}

export class ErrorBoundary extends React.Component<Props, State> {
  state = { hasError: false }

  static defaultProps = {
    action: "ErrorBoundary"
  }

  static getDerivedStateFromError(error: any): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  componentDidCatch(error: any, info: any): void {
    const { instance: appsignal, action } = this.props
    const { name, message } = error
    const span = appsignal.createSpan()

    span.setAction(action)

    span.setError({
      name,
      message,
      stack: info.componentStack
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
