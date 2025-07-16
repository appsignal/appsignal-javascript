import { Breadcrumb } from "./breadcrumb"
import { JSSpan } from "./span"
import { Decorator, Override } from "./hook"

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
 * AppSignal for JavaScripts main class.
 */
export interface JSClient extends BaseClient {
  ignored: RegExp[]

  /**
   * Records and sends a browser `Error` to AppSignal.
   */
  send<T>(error: Error, fn?: (span: JSSpan) => T): Promise<JSSpan> | void

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

  sendError<T>(error: Error): Promise<JSSpan> | void
  sendError<T>(error: Error, fn?: (span: JSSpan) => T): Promise<JSSpan> | void

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
  wrap<T>(fn: () => T, callbackFn?: (span: JSSpan) => T): Promise<T>

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
  addDecorator<T extends Decorator>(decorator: T): void

  /**
   * Registers a span override to be applied every time a Span
   * is sent to the Push API
   */
  addOverride<T extends Override>(override: T): void

  /**
   * Sends a demonstration error to AppSignal.
   */
  demo(): void

  /**
   * Adds a breadcrumb.
   */
  addBreadcrumb(breadcrumb: Omit<Breadcrumb, "timestamp">): void
}
