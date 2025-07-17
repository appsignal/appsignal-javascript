import { JSX } from "preact"
import type Appsignal from "@appsignal/javascript"

export type Props = {
  instance: Appsignal
  action?: string
  children: JSX.Element
  fallback?: Function
  tags?: { [key: string]: string }
}

export type State = {
  error?: Error
}
