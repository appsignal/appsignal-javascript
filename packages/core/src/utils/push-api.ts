import fetch from "isomorphic-unfetch"

export async function validatePushApiKey({
  endpoint = "https://push.appsignal.com",
  apiKey
}: {
  endpoint?: string
  apiKey: string
}) {
  const { status } = await fetch(`${endpoint}/1/auth?api_key=${apiKey}`)

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
