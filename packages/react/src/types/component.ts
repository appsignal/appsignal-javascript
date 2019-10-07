export type Props = {
  instance: any
  action?: string
  children: React.ReactNode
  fallback?: Function
  tags?: { [key: string]: string }
}

export type State = {
  error?: Error
}
