import { Error } from "./error"

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

  environment: { [key: string]: string }
}
