import { HashMap, HashMapValue } from "./common"
import { Error } from "./error"
import { Breadcrumb } from "./breadcrumb"

export type SpanData = {
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
