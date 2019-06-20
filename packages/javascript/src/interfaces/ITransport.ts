export interface ITransport {
  url: string
  send(data: string): Promise<any>
}
