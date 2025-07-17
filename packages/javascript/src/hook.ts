import { Span } from "./span"

export type Hook = Decorator | Override
export type Decorator = (span: Span) => Span
export type Override = (span: Span) => Span | false
