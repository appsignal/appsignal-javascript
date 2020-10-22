import { Tracer } from "./tracer"
import { Metrics } from "./metrics"
import { Plugin } from "./plugin"
import { Breadcrumb } from "./breadcrumb"
import { JSSpan } from "./span"
import { Hook } from "./hook"

interface Configuration {
  readonly debug: boolean
  readonly isValid: boolean
}

interface BaseClient {
  /**
   * The current version of the integration.
   */
  readonly VERSION: string
}

/**
 * AppSignal for Node.js's main class.
 *
 * Provides methods to control the AppSignal instrumentation and the system
 * agent.
 */
export interface NodeClient extends BaseClient {
  /**
   * Returns `true` if the agent is loaded and configuration is valid.
   */
  readonly isActive: boolean

  config: Configuration

  /**
   * Starts AppSignal with the given configuration. If no configuration is set
   * yet it will try to automatically load the configuration using the
   * environment loaded from environment variables and the current working
   * directory.
   */
  start(): void

  /**
   * Stops the AppSignal agent.
   *
   * Call this before the end of your program to make sure the
   * agent is stopped as well.
   */
  stop(calledBy?: string): void

  /**
   * Returns the current `Tracer` instance.
   *
   * If the agent is inactive when this method is called, the method
   * returns a `NoopTracer`, which will do nothing.
   */
  tracer(): Tracer

  /**
   * Returns the current `Metrics` object.
   *
   * To track application-wide metrics, you can send custom metrics to AppSignal.
   * These metrics enable you to track anything in your application, from newly
   * registered users to database disk usage. These are not replacements for custom
   * instrumentation, but provide an additional way to make certain data in your
   * code more accessible and measurable over time.
   *
   * With different types of metrics (gauges, counters and measurements)
   * you can track any kind of data from your apps and tag them with metadata
   * to easily spot the differences between contexts.
   */
  metrics(): Metrics

  /**
   * Allows a named module to be modified by a function. The function `fn`
   * returns a `Plugin`, which will be loaded by the instrumentation manager
   * when the module is required.
   */
  instrument<T>(plugin: {
    PLUGIN_NAME: string
    instrument: (module: T, tracer: Tracer, meter: Metrics) => Plugin<T>
  }): this
}

/**
 * AppSignal for JavaScripts main class.
 */
export interface JSClient extends BaseClient {
  ignored: RegExp[]

  /**
   * Records and sends a browser `Error` to AppSignal.
   */
  send(error: Error, tags?: object, namespace?: string): Promise<JSSpan> | void

  /**
   * Records and sends an Appsignal `Span` object to AppSignal.
   */
  send(span: JSSpan): Promise<JSSpan> | void

  send(
    data: Error | JSSpan,
    tags?: object,
    namespace?: string
  ): Promise<any> | void

  /**
   * Records and sends a browser `Error` to AppSignal. An alias to `#send()`
   * to maintain compatibility.
   */
  sendError(
    error: Error,
    tags?: object,
    namespace?: string
  ): Promise<JSSpan> | void

  /**
   * Registers and installs a valid plugin.
   *
   * A plugin is typically a function that can be used to provide a
   * reference to the `Appsignal` instance via returning a function
   * that can be bound to `this`.
   */
  use(plugin: Function): void

  /**
   * Creates a new `Span`, augmented with the current environment.
   */
  createSpan(fn?: (span: JSSpan) => void): JSSpan

  /**
   * Wraps and catches errors within a given function. If the function throws an
   * error, a rejected `Promise` will be returned and the error thrown will be
   * logged to AppSignal.
   */
  wrap<T>(fn: () => T, tags?: {}, namespace?: string): Promise<T>

  /**
   * Registers a span decorator to be applied every time a Span
   * is sent to the Push API
   */
  addDecorator<T extends Hook>(decorator: T): void

  /**
   * Registers a span override to be applied every time a Span
   * is sent to the Push API
   */
  addOverride<T extends Hook>(override: T): void

  /**
   * Sends a demonstration error to AppSignal.
   */
  demo(): void

  /**
   * Adds a breadcrumb.
   */
  addBreadcrumb(breadcrumb: Omit<Breadcrumb, "timestamp">): void
}
