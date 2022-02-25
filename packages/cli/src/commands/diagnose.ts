import { spawnSync } from "child_process"
import { checkForAppsignalPackage } from "../utils"

/**
 * Usage: npx @appsignal/cli diagnose [options]
 *
 * runs the diagnose command (Node.js integration only)
 *
 * Options:
 * -e, --environment <env>  Which environment to use
 * -k, --api-key <key>      Which API key to use
 * -h, --help               display help for command
 * --no-report              Don't send report automatically send the report to AppSignal
 *
 * This command just spawns the diagnose command from the `@appsignal/nodejs`
 * package as a child process.
 */
export const diagnose = ({
  apiKey,
  environment,
  report = true
}: {
  apiKey?: string
  environment?: string
  report: boolean
}): void => {
  const cwd = process.cwd()

  checkForAppsignalPackage()

  if (apiKey) {
    process.env["APPSIGNAL_PUSH_API_KEY"] = apiKey
  }

  if (environment) {
    process.env["APPSIGNAL_APP_ENV"] = environment
  }

  spawnSync(
    `${cwd}/node_modules/@appsignal/nodejs/bin/diagnose`,
    !report ? ["--no-report"] : undefined,
    {
      cwd,
      stdio: "inherit"
    }
  )
}
