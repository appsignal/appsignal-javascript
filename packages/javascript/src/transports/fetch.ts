import { ITransport } from "../interfaces/ITransport"

export class FetchTransport implements ITransport {
  public url: string

  constructor(url: string, headers?: { [key: string]: string }) {
    this.url = url
  }

  public async send(data: string): Promise<any> {
    const res = await fetch(this.url, {
      method: "POST",
      body: data
    })

    const { statusText, ok } = res

    return ok ? Promise.resolve({}) : Promise.reject({ statusText })
  }
}
