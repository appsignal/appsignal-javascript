/**
 * Converts all values in a flat object to a string.
 *
 * Adapted from https://stackoverflow.com/questions/46982698/how-do-i-convert-all-property-values-in-an-object-to-type-string
 *
 * @param   {object}  obj:      A flat object structure
 *
 * @return  {object}            A sanitized object
 */
export function sanitizeParams(obj: { [key: string]: any }): object {
  Object.keys(obj).forEach(k => {
    if (typeof obj[k] === "object") {
      return sanitizeParams(obj[k])
    }

    obj[k] = String(obj[k])
  })

  return obj
}
