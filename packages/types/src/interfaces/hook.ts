import { JSSpan } from "./span"

export type Hook = Decorator | Override
export type Decorator = (span: JSSpan) => JSSpan
export type Override = (span: JSSpan) => JSSpan | false
