import { JSSpan } from "./span"

export interface Hook {
  (span: JSSpan): JSSpan
}
