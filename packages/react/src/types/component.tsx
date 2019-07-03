export type Props = {
  instance: any
  action: string
  children: React.ReactNode
  fallback: Function
}

export type State = {
  error?: Error
}
