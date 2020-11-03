import axios from "axios"

export async function validate({
  endpoint = "https://push.appsignal.com",
  apiKey
}: {
  endpoint?: string
  apiKey: string
}) {
  const { status } = await axios.get(`${endpoint}/1/auth?api_key=${apiKey}`, {
    validateStatus: status => {
      // these are the only valid responses we expect, everything else
      // should reject the promise
      return status === 200 || status === 401
    }
  })

  switch (status) {
    case 200:
      return true
    case 401:
      return false
    default:
      throw new Error(
        `Invalid ${status} response from server when authenticating`
      )
  }
}
