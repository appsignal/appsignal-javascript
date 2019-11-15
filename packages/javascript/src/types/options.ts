type BaseOptions = {
  key: string
  uri?: string
}

export type AppsignalOptions = BaseOptions & {
  namespace?: string
  revision?: string
  ignore?: RegExp[]
}

export type PushApiOptions = BaseOptions & {
  version: string
}
