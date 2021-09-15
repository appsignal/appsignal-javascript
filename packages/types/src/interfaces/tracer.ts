import { EventEmitter } from "events"

import { NodeSpan, NodeSpanOptions, SpanContext } from "./span"
import { Func } from "../types/common"

/**
 * The Tracer object contains various methods that you might use when creating
 * your own custom instrumentation. It is responsible for tracking the currently
 * active Span, and exposes functions for creating and activating new Spans.
 */
export interface Tracer {
  /**
   * Creates a new `Span` instance. If a `Span` is passed as the optional second
   * argument, then the returned `Span` will be a `ChildSpan`.
   */
  createSpan(options?: Partial<NodeSpanOptions>, span?: NodeSpan): NodeSpan

  /**
   * Creates a new `Span` instance. If a `SpanContext` is passed as the optional second
   * argument, then the returned `Span` will be a `ChildSpan`.
   */
  createSpan(
    options?: Partial<NodeSpanOptions>,
    context?: SpanContext
  ): NodeSpan

  /**
   * Returns the current Span.
   *
   * If there is no current Span available, `undefined` is returned.
   */
  currentSpan(): NodeSpan

  /**
   *
   * Returns the root Span.
   *
   */
  rootSpan(): NodeSpan

  /**
   * Adds the given error to the root Span.
   *
   * If there is no root Span available to add the error, `undefined` is returned.
   */
  addError(error: Error): NodeSpan | undefined

  /**
   * Executes a given function asynchronously within the context of a given
   * `Span`. When the function has finished executing, any value returned by
   * the given function is returned, but the `Span` remains active unless it is
   * explicitly closed.
   *
   * The `Span` is passed as the single argument to the given function. This
   * allows you to create children of the `Span` for instrumenting nested
   * operations.
   */
  withSpan<T>(span: NodeSpan, fn: (s: NodeSpan) => T): T

  /**
   * Wraps a given function in the current `Span`s scope.
   */
  wrap<T>(fn: Func<T>): Func<T>

  /**
   * Wraps an `EventEmitter` in the current `Span`s scope.
   */
  wrapEmitter(emitter: EventEmitter): void
}
