/**
 * The standard format for an error that is passed to AppSignal.
 */
export type Error = {
  name: string
  message?: string
  backtrace?: string[]
}
