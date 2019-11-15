/**
 * Encodes given object into url-friendly format
 *
 * @param   {object}  object:   [object: An object that contains serializable values]
 *
 * @return  {string}            [Encoded URI params]
 */
export function urlEncode(object: { [key: string]: any }): string {
  return Object.keys(object)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(object[key])}`)
    .join("&")
}
