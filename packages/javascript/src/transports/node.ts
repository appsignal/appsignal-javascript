import { Transport } from "../interfaces/transport"

export class NodeTransport implements Transport {
  public url: string

  constructor(url: string) {
    this.url = url
  }

  public send(data: string): Promise<any> {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": data.length
      }
    }

    return new Promise((resolve, reject) => {
      import("https")
        .then(https => {
          const req = https
            .request(this.url, options, () => {})
            .on("error", error => reject(error))

          req.write(data)
          req.end()

          resolve({})
        })
        .catch(reject)
    })
  }
}
