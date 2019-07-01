import { Error } from "./error"
import { BrowserEnvironment } from "./environment"

export type Span = {
  timestamp: number
  action?: string
  namespace: string
  error: Error
  revision?: string

  tags?: {
    [key: string]: string
  }

  params?: {
    [key: string]: string
  }

  environment: Partial<BrowserEnvironment>
}
