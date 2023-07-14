import { spawnSync } from "child_process"
import { checkForAppsignalPackage } from "../utils"
import { accessSync, constants } from "fs"

/**
 * Usage: npx @appsignal/cli diagnose [options]
 *
 * runs the diagnose command (Node.js integration only)
 *
 * Options:
 * -e, --environment <env>  Which environment to use
 * -k, --api-key <key>      Which API key to use
 * -h, --help               Display help for command
 * --send-report            Automatically send the report to AppSignal
 * --no-send-report         Don't send the report automatically to AppSignal
 *
 * This command just spawns the diagnose command from the `@appsignal/nodejs`
 * package as a child process.
 */
export const diagnose = ({
  apiKey,
  environment,
  sendReport
}: {
  apiKey?: string
  environment?: string
  sendReport: boolean | undefined
}): void => {
  const cwd = process.cwd()

  checkForAppsignalPackage()

  if (apiKey) {
    process.env["APPSIGNAL_PUSH_API_KEY"] = apiKey
  }

  if (environment) {
    process.env["APPSIGNAL_APP_ENV"] = environment
  }

  let args = []
  switch (sendReport) {
    case true:
      args.push("--send-report")
      break
    case false:
      args.push("--no-send-report")
      break
  }

  try {
    accessSync(
      `${cwd}/node_modules/@appsignal/nodejs/bin/diagnose`,
      constants.X_OK
    )
  } catch (e) {
    console.error("Didn't have permissions to execute the diagnose binary.")
    console.error(
      "Ensure that you have execute permissions for the `node_modules` folder. Exiting."
    )

    process.exit(1)
  }

  const result = spawnSync(
    `${cwd}/node_modules/@appsignal/nodejs/bin/diagnose`,
    args,
    { cwd, stdio: "inherit" }
  )

  if (result.error) {
    console.error("Something went wrong when executing the diagnose report:")
    console.error(result.error)

    process.exit(1)
  }

  if (result.status) {
    process.exit(result.status)
  }
}
