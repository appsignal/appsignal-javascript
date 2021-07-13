import type { JSClient } from "@appsignal/types"

export type Props = {
  instance: JSClient
  action?: string
  addUrl?: boolean
  children: React.ReactNode
  fallback?: Function
  tags?: { [key: string]: string }
}

export type State = {
  error?: Error
}
