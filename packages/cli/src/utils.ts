export function checkForAppsignalPackage() {
  try {
    console.log("🔭 Checking your package.json for @appsignal/nodejs...")
    const pkg = require(`${process.cwd()}/package.json`)

    if (!("@appsignal/nodejs" in (pkg.dependencies || {}))) {
      console.error("Couldn't find @appsignal/nodejs in your dependencies")
      process.exit(1)
    }

    console.log("✅ Found it!")
  } catch (e) {
    console.error(
      "Couldn't find a package.json in your current working directory"
    )

    process.exit(1)
  }
}
