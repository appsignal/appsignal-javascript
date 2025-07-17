export interface Transport {
  url: string
  send(data: string): Promise<any>
}
