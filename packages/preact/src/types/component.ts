import { JSX } from "preact"
import type { JSClient } from "@appsignal/types"

export type Props = {
  instance: JSClient
  action?: string
  children: JSX.Element
  fallback?: Function
  tags?: { [key: string]: string }
}

export type State = {
  error?: Error
}
