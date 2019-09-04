import { HashMap, HashMapValue } from "./common"

export type Breadcrumb = {
  timestamp: number
  category: string
  action: string
  message?: string
  metadata?: HashMap<HashMapValue>
}
