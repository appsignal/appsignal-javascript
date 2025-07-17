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
 * Converts all values in a flat object to a string.
 *
 * Adapted from https://stackoverflow.com/questions/46982698/how-do-i-convert-all-property-values-in-an-object-to-type-string
 */
export function toHashMapString(
  obj?: HashMap<any>
): HashMap<string> | undefined {
  if (!obj) return

  const hm: HashMap<string> = {}

  Object.keys(obj).forEach(k => {
    if (typeof obj[k] === "object") {
      hm[k] = JSON.stringify(obj[k])
    } else {
      hm[k] = String(obj[k])
    }
  })

  return hm
}

/**
 * Converts any non-string, boolean or number value in an object to a string
 */
export function toHashMap(
  obj?: HashMap<any>
): HashMap<HashMapValue> | undefined {
  if (!obj) return

  const hm: HashMap<HashMapValue> = {}

  Object.keys(obj).forEach(k => {
    if (
      typeof obj[k] === "string" ||
      typeof obj[k] === "boolean" ||
      typeof obj[k] === "number"
    ) {
      hm[k] = obj[k]
    } else {
      hm[k] = JSON.stringify(obj[k])
    }
  })

  return hm
}
