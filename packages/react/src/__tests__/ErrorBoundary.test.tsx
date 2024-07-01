import React from "react"
import { render, cleanup } from "@testing-library/react"
import { ErrorBoundary } from "../ErrorBoundary"
import { JSSpan } from "@appsignal/types"

describe("<ErrorBoundary />", () => {
  let instance: any

  const Broken = () => {
    throw new Error("From component")
    return <div></div>
  }

  const BrokenEvent = () => {
    throw new Event("From component")
    return <div></div>
  }

  let mock: any

  let SpanMock: any

  beforeEach(() => {
    jest.resetAllMocks()
    mock = {
      setAction: jest.fn(() => mock),
      setError: jest.fn(() => mock),
      setTags: jest.fn(() => mock)
    }
    SpanMock = jest.fn().mockImplementation(() => mock)
    instance = {
      createSpan: () => new SpanMock(),
      send: jest.fn()
    }
  })

  afterEach(() => {
    cleanup()
  })

  it("catches an error from its children", () => {
    render(
      <ErrorBoundary instance={instance}>
        <Broken />
      </ErrorBoundary>
    )

    expect(mock.setAction).not.toBeCalled()
    expect(mock.setTags).toBeCalledWith({ framework: "React" })
    expect(mock.setError).toBeCalled()

    expect(instance.send).toBeCalled()
  })

  it("modifies the action if provided as a prop", () => {
    render(
      <ErrorBoundary instance={instance} action="testaction">
        <Broken />
      </ErrorBoundary>
    )

    expect(mock.setAction).toBeCalledWith("testaction")
    expect(mock.setTags).toBeCalledWith({ framework: "React" })
    expect(mock.setError).toBeCalled()

    expect(instance.send).toBeCalled()
  })

  it("modifies the tags if provided as a prop", () => {
    render(
      <ErrorBoundary instance={instance} tags={{ foo: "bar" }}>
        <Broken />
      </ErrorBoundary>
    )

    expect(mock.setAction).not.toBeCalled()
    expect(mock.setTags).toBeCalledWith({ framework: "React", foo: "bar" })
    expect(mock.setError).toBeCalled()

    expect(instance.send).toBeCalled()
  })

  it("uses the override callback to modify the span if provided", () => {
    const override = (span: JSSpan) => {
      span.setTags({ foo: "overriden" })
      span.setAction("overriden")
      return span
    }

    render(
      <ErrorBoundary
        instance={instance}
        action="testaction"
        tags={{ foo: "bar" }}
        override={override}
      >
        <Broken />
      </ErrorBoundary>
    )

    expect(mock.setAction).toHaveBeenLastCalledWith("overriden")

    // The tags will be merged by the span, although we don't assert that
    // due to this mock-based test implementation.
    expect(mock.setTags).toHaveBeenLastCalledWith({ foo: "overriden" })

    expect(mock.setError).toBeCalled()

    expect(instance.send).toBeCalled()
  })

  it("renders a fallback if available", () => {
    const { queryByText } = render(
      <ErrorBoundary instance={instance} fallback={() => <div>Fallback</div>}>
        <Broken />
      </ErrorBoundary>
    )

    expect(queryByText("Fallback")).toBeDefined()
  })
})
