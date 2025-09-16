interface BaseOptions {
  key?: string
  uri?: string
}

export type BacktraceMatcher = (path: string) => string | undefined

export interface AppsignalOptions extends BaseOptions {
  namespace?: string
  revision?: string
  ignoreErrors?: RegExp[]
  matchBacktracePaths?:
    | RegExp
    | BacktraceMatcher
    | (RegExp | BacktraceMatcher)[]
}

export interface PushApiOptions extends BaseOptions {
  key: string
  version: string
}
