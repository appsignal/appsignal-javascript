import type { HashMap, HashMapValue } from "@appsignal/types"

/**
 * Converts all values in a flat object to a string.
 *
 * Adapted from https://stackoverflow.com/questions/46982698/how-do-i-convert-all-property-values-in-an-object-to-type-string
 */
export function toHashMapString(
  obj?: HashMap<any>
): HashMap<string> | undefined {
  if (!obj) return

  Object.keys(obj).forEach(k => {
    if (typeof obj[k] === "object") {
      obj[k] = JSON.stringify(obj[k])
    }

    obj[k] = String(obj[k])
  })

  return obj
}

/**
 * Converts any non-string, boolean or number value in an object to a string
 */
export function toHashMap(
  obj?: HashMap<any>
): HashMap<HashMapValue> | undefined {
  if (!obj) return

  Object.keys(obj).forEach(k => {
    if (
      typeof obj[k] === "string" ||
      typeof obj[k] === "boolean" ||
      typeof obj[k] === "number"
    ) {
      return
    }

    obj[k] = JSON.stringify(obj[k])
  })

  return obj
}
