import { Transport } from "../interfaces/transport"
import type https from "https"
export class NodeTransport implements Transport {
  public url: string
  private https: Promise<typeof https>

  constructor(url: string) {
    this.url = url
    this.https = import("https")
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
      this.https
        .then(https => {
          const req = https
            .request(this.url, options, () => {})
            .on("error", error => reject(error))

          req.write(data)
          req.end()

          resolve({})
        })
        .catch(reason => {
          console.warn(
            "NodeTransport is being used, but the HTTPS module could not be imported. No data will be sent to AppSignal."
          )
          reject(reason)
        })
    })
  }
}
