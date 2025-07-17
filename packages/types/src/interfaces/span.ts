import { HashMap, HashMapValue } from "../types/common"
import { Error as SpanError } from "../types/error"
import { Breadcrumb } from "./breadcrumb"

/**
 * A `Span` is the name of the object that we use to capture data about the
 * performance of your application, any errors and any surrounding context.
 */
export interface JSSpan {
  setAction(name: string): this
  getAction(): string | undefined

  setNamespace(name: string): this
  getNamespace(): string | undefined

  setError<T extends Error>(error: Error | T): this
  getError(): SpanError | undefined

  setTags(tags: HashMap<string>): this
  getTags(): HashMap<string>

  setParams(params: HashMap<any>): this
  getParams(): HashMap<any>

  setBreadcrumbs(breadcrumbs: Breadcrumb[]): this
  getBreadcrumbs(): Breadcrumb[]

  setEnvironment(environment: HashMap<string>): this
  getEnvironment(): HashMap<string>
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
  params?: HashMap<any>
  environment?: HashMap<string>
  breadcrumbs?: Breadcrumb[]
}
