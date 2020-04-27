import { Span } from "../span"

export interface Hook {
  (span: Span): Span
}
