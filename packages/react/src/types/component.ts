import type { JSClient, JSSpan } from "@appsignal/types"
import type React from "react"

export type Props = {
  instance: JSClient
  action?: string
  children: React.ReactNode
  fallback?: (error?: Error) => React.ReactNode
  override?: (span: JSSpan, error?: Error) => JSSpan
  tags?: { [key: string]: string }
}

export type State = {
  error?: Error
}
