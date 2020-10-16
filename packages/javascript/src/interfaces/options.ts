interface BaseOptions {
  key?: string
  uri?: string
}

export interface AppsignalOptions extends BaseOptions {
  namespace?: string
  revision?: string
  ignoreErrors?: RegExp[]
}

export interface PushApiOptions extends BaseOptions {
  key: string
  version: string
}
