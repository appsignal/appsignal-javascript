import { Transport } from "../transport"

export class FetchTransport implements Transport {
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
