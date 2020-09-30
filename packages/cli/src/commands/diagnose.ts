import { spawn } from "child_process"

/**
 * Usage: npx @appsignal/cli diagnose [options]
 *
 * runs the diagnose command (Node.js integration only)
 *
 * Options:
 * -e, --environment <env>  Which environment to use
 * -k, --api-key <key>      Which API key to use
 * -h, --help               display help for command
 *
 * This command just spawns the diagnose command from the `@appsignal/nodejs`
 * package as a child process.
 */
export const diagnose = ({
  apiKey,
  environment
}: {
  apiKey?: string
  environment?: string
}): void => {
  // some checks to ensure we are in the right place
  try {
    console.log("🔭 Checking your package.json for @appsignal/nodejs...")
    const pkg = require(`${process.cwd()}/package.json`)

    if (!("@appsignal/nodejs" in pkg.dependencies)) {
      console.error("Couldn't find @appsignal/nodejs in your dependencies")
      process.exit(1)
    }

    console.log("✅ Found it! Running the diagnose tool...")
  } catch (e) {
    console.error(
      "Couldn't find a package.json in your current working directory"
    )

    process.exit(1)
  }

  if (apiKey) {
    process.env["APPSIGNAL_PUSH_API_KEY"] = apiKey
  }

  if (environment) {
    process.env["APPSIGNAL_APP_ENV"] = environment
  }

  const diag = spawn(
    `${process.cwd()}/node_modules/@appsignal/nodejs/bin/diagnose`,
    {
      cwd: __dirname,
      stdio: "inherit"
    }
  )

  diag.on("close", code => {
    console.log(`Child process exited with code ${code}`)
    process.exit(0)
  })
}
