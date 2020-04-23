type BaseOptions = {
  key?: string
  uri?: string
}

export type AppsignalOptions = BaseOptions & {
  namespace?: string
  revision?: string
  ignoreErrors?: RegExp[]
}

export type PushApiOptions = BaseOptions & {
  key: string
  version: string
}
