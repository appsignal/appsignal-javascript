import { Error } from "./error"
import { Breadcrumb } from "./breadcrumb"

export type SpanData = {
  timestamp: number
  action?: string
  namespace: string
  error: Error
  revision?: string
  tags?: {
    [key: string]: string
  }
  params?: {
    [key: string]: string | number | boolean
  }
  environment?: {
    [key: string]: string
  }
  breadcrumbs?: Breadcrumb[]
}
