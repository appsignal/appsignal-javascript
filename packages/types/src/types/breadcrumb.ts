export type Breadcrumb = {
  timestamp: number
  category: string
  action: string
  message?: string
  metadata?: { [key: string]: string | number | boolean }
}
