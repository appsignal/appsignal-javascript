import { existsSync } from "fs"
import { dirname } from "path"
import fetch from "isomorphic-unfetch"

// Returns the filesystem location at which the root of the
// `@appsignal/nodejs` package was found.
export function checkForAppsignalPackage(): string {
  console.log("🔭 Checking for @appsignal/nodejs...")

  try {
    const pkg = require(`${process.cwd()}/package.json`)

    if (!("@appsignal/nodejs" in (pkg.dependencies || {}))) {
      console.error(
        "Couldn't find @appsignal/nodejs in your dependencies. Exiting."
      )

      process.exit(1)
    }
  } catch (e) {
    console.error(
      "Couldn't find a package.json in your current working directory. Exiting."
    )

    process.exit(1)
  }

  let currentRoot = process.cwd()

  // Look for the package in parent folders (yarn workspaces)
  while (currentRoot !== "/") {
    const currentPath = `${currentRoot}/node_modules/@appsignal/nodejs`

    if (existsSync(currentPath)) {
      console.log(`✅ Found it! (at ${currentRoot})`)

      return currentPath
    }

    currentRoot = dirname(currentRoot)
  }

  console.error(
    "Couldn't find the `@appsignal/nodejs` package in your `node_modules` folder."
  )
  console.error("Please run `npm install` and try again. Exiting.")

  process.exit(1)
}

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
