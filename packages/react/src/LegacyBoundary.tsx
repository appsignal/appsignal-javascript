import React from "react"
import { Props, State } from "./types/component"

export class LegacyBoundary extends React.Component<Props, State> {
  state = { error: undefined }

  static defaultProps = {
    action: ""
  }

  public unstable_handleError(error: Error): void {
    const { instance: appsignal, action, tags = {} } = this.props
    const { name, message, stack } = error
    const span = appsignal.createSpan()

    span
      .setError({
        name,
        message,
        stack
      })
      .setTags({ framework: "Legacy React", ...tags })

    if (action && action !== "") span.setAction(action)

    appsignal.send(span)

    this.setState({ error })
  }

  public render(): React.ReactNode {
    // we create a new <div> here to prevent React from complaining
    // about not being able to use unmountComponent
    return (
      <div>
        {!this.state.error
          ? this.props.children
          : this.props.fallback
          ? this.props.fallback(this.state.error)
          : null}
      </div>
    )
  }
}
