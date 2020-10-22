import { HashMap, HashMapValue } from "../types/common"
import { Error } from "../types/error"
import { Breadcrumb } from "./breadcrumb"

/**
 * The state of a `Span` at initialization time.
 */
export interface NodeSpanOptions {
  namespace?: string
  startTime?: number
}

/**
 * Represents all the information that identifies `Span` in the Trace and MUST be
 * propagated to child `Span`s and across process boundaries.
 */
export interface SpanContext {
  /**
   * The current ID of the trace.
   */
  traceId: string

  /**
   * The current ID of the Span.
   */
  spanId: string

  /**
   * The options for a trace.
   */
  traceFlags?: { sampled: boolean }

  /**
   * The tracing-system specific context.
   */
  traceState?: HashMap<string>
}

/**
 * A `Span` is the name of the object that we use to capture data about the
 * performance of your application, any errors and any surrounding context.
 * A `Span` can form a part of a broader trace, a hierarchical representation
 * of the flow of data through your application.
 */
export interface NodeSpan {
  /**
   * The current ID of the trace.
   */
  traceId: string

  /**
   * The current ID of the Span.
   */
  spanId: string

  /**
   * Sets the name for a given Span. The Span name is used in the UI to group
   * like requests together.
   */
  setName(name: string): this

  /**
   * Sets the category for a given Span. The category groups Spans together
   * in the "Slow Events" feature, and in the "Sample breakdown".
   */
  setCategory(name: string): this

  /**
   * Sets arbitrary data on the current `Span`.
   */
  set(key: string, value: string | number | boolean): this

  /**
   * Returns a new `Span` object that is a child of the current `Span`.
   */
  child(): NodeSpan

  /**
   * Adds a given `Error` object to the current `Span`.
   */
  addError(error: Error): this

  /**
   * Sets a data collection as sample data on the current `Span`.
   */
  setSampleData(
    key: string,
    data:
      | Array<
          HashMapValue | Array<HashMapValue> | HashMap<HashMapValue> | undefined
        >
      | HashMap<
          HashMapValue | Array<HashMapValue> | HashMap<HashMapValue> | undefined
        >
  ): this

  /**
   * Adds sanitized SQL data as a string to a Span.
   *
   * If called with a single argument, the `value` will be applied to the
   * span as the body, which will show the sanitized query in your dashboard.
   */
  setSQL(value: string): this

  /**
   * Completes the current `Span`.
   *
   * If an `endTime` is passed as an argument, the `Span` is closed with the
   * timestamp that you provide. `endTime` should be a numeric
   * timestamp in milliseconds since the UNIX epoch.
   */
  close(endTime?: number): this

  /**
   * Returns a JSON string representing the internal Span in the agent.
   */
  toJSON(): string
}

/**
 * A `Span` is the name of the object that we use to capture data about the
 * performance of your application, any errors and any surrounding context.
 */
export interface JSSpan {
  setAction(name: string): this

  setNamespace(name: string): this

  setError<T extends Error>(error: Error | T): this

  setTags(tags: HashMap<string>): this

  setParams(params: HashMap<HashMapValue>): this

  setBreadcrumbs(breadcrumbs: Breadcrumb[]): this
}

/**
 * The internal data structure of a `Span` inside the JavaScript integration.
 */
export interface JSSpanData {
  timestamp: number
  action?: string
  namespace: string
  error: Error
  revision?: string
  tags?: HashMap<string>
  params?: HashMap<HashMapValue>
  environment?: HashMap<string>
  breadcrumbs?: Breadcrumb[]
}
