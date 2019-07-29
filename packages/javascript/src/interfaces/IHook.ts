import { Span } from "../span"

export interface IHook {
  (span: Span): Span
}
