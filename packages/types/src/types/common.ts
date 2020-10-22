/**
 * `HashMapValue` is a union type that corresponds to the valid types accepted
 * inside the AppSignal processors `HashMap` type in Rust.
 */
export type HashMapValue = string | number | boolean

/**
 * A generic HashMap, with a string as the indexable value.
 */
export type HashMap<T> = {
  [key: string]: T
}

/**
 * A function with a spread of arguments, returning a generic type.
 */
export type Func<T = void> = (...args: any[]) => T
