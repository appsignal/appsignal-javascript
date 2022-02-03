import { HashMap, HashMapValue } from "../types/common"
import { Error } from "../types/error"
import { Breadcrumb } from "./breadcrumb"

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
