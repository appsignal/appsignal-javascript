import * as React from "react"
import { Props, State } from "./types/component"

const DEFAULT_ACTION = "LegacyBoundary"

export class LegacyBoundary extends React.Component<Props, State> {
  state = { hasError: false }

  static defaultProps = {
    action: DEFAULT_ACTION
  }

  public unstable_handleError(error: Error) {
    const { instance: appsignal, action } = this.props
    const { name, message, stack } = error
    const span = appsignal.createSpan()

    span.setAction(action !== "" ? action : DEFAULT_ACTION)

    span.setError({
      name,
      message,
      stack
    })

    span.setTags({ framework: "Legacy React" })

    appsignal.send(span)

    this.setState({
      hasError: true
    })
  }

  public render(): React.ReactNode {
    // we create a new <div> here to prevent React from complaining
    // about not being able to use unmountComponent
    return <div>{!this.state.hasError ? this.props.children : null}</div>
  }
}
