import type Appsignal from "@appsignal/javascript"
import type { Span } from "@appsignal/javascript"
import type React from "react"

export type Props = {
  instance: Appsignal
  action?: string
  children: React.ReactNode
  fallback?: (error?: Error) => React.ReactNode
  override?: (span: Span, error?: Error) => Span
  tags?: { [key: string]: string }
}

export type State = {
  error?: Error
}
