import { Transport } from "../interfaces/transport"

export class XHRTransport implements Transport {
  public url: string

  constructor(url: string) {
    this.url = url
  }

  public send(data: string): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const req = new XMLHttpRequest()

        req.onreadystatechange = () => {
          if (req.readyState === XMLHttpRequest.DONE) {
            resolve({})
          }
        }

        req.open("POST", this.url)
        req.send(data)
      } catch (e) {
        reject(e)
      }
    })
  }
}
