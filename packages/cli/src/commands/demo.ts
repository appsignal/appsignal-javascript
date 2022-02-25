import { spawn } from "child_process"
import chalk from "chalk"
import { checkForAppsignalPackage } from "../utils"

export function demo({
  apiKey,
  environment,
  application
}: {
  apiKey?: string
  environment?: string
  application?: string
}): void {
  checkForAppsignalPackage()

  if (apiKey) {
    process.env["APPSIGNAL_PUSH_API_KEY"] = apiKey
  }

  if (environment) {
    process.env["APPSIGNAL_APP_ENV"] = environment
  }

  if (application) {
    process.env["APPSIGNAL_APP_NAME"] = application
  }

  spawnDemo()
}

export function spawnDemo(env: { [key: string]: string } = {}): void {
  spawn("node", [__filename], {
    cwd: process.cwd(),
    detached: true,
    env: {
      ...process.env,
      ...env
    },
    stdio: "ignore"
  }).unref()

  console.log() // blank line

  console.log(chalk.greenBright("📡 Demonstration sample data sent!"))

  console.log() // blank line

  console.log(
    "It may take a minute for the data to appear on https://appsignal.com/accounts"
  )
}

if (require.main === module) {
  const {
    Appsignal
  } = require(`${process.cwd()}/node_modules/@appsignal/nodejs/dist`)

  const appsignal = new Appsignal({ active: true })

  try {
    appsignal.demo()

    // cull the process automatically after 90 secs
    setTimeout(() => process.exit(0), 90 * 1000)
  } catch (e) {
    process.exit(1)
  }
}
