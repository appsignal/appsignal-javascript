import { JSClient } from "@appsignal/types"
import { JSX } from "preact"

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
