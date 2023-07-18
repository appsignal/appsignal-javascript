import { existsSync } from "fs"

export function checkForAppsignalPackage() {
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

  if (!existsSync(`${process.cwd()}/node_modules/@appsignal/nodejs`)) {
    console.error(
      "Couldn't find the `@appsignal/nodejs` package in your `node_modules` folder."
    )
    console.error("Please run `npm install` and try again. Exiting.")

    process.exit(1)
  }

  console.log("✅ Found it!")
}
