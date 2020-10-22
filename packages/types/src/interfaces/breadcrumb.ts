import { HashMap, HashMapValue } from "../types/common"

/**
 * Breadcrumbs are a time-ordered list of events in your application, that is
 * filled as a user traverses your application, and is sent along with a `Span`
 * whenever an error is caught by the library.
 */
export interface Breadcrumb {
  timestamp: number
  category: string
  action: string
  message?: string
  metadata?: HashMap<HashMapValue>
}
