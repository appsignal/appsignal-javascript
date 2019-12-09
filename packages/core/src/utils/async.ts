/**
 * Returns `true` if the function is an async function.
 *
 * Adapted from https://davidwalsh.name/javascript-detect-async-function
 */
export const isAsync = (fn: Function) => fn.constructor.name === "AsyncFunction"
