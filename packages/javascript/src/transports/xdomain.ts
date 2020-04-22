import { ITransport } from "../interfaces/ITransport"

// Fixes TypeScript complaining about this class
// not existing
declare var XDomainRequest: any

export class XDomainTransport implements ITransport {
  public url: string

  constructor(url: string) {
    this.url = url
  }

  public send(data: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const req = new XDomainRequest()
      const rx = new RegExp("^https?:")

      req.onload = () => resolve({})

      // XDomainRequest will only make a request to a URL with
      // the same protocol
      req.open("POST", this.url.replace(rx, window?.location?.protocol))

      setTimeout(() => {
        try {
          req.send(data)
        } catch (e) {
          reject(e)
        }
      }, 0)
    })
  }
}
