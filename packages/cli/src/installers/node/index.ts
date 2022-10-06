import { existsSync } from "fs"
import { spawnSync } from "child_process"
import chalk from "chalk"
import inquirer from "inquirer"
import { validatePushApiKey } from "@appsignal/core"
import * as fs from "fs"
import * as path from "path"

import { SUPPORTED_NODEJS_INTEGRATIONS } from "../../constants"
import { spawnDemo } from "../../commands/demo"

/**
 * Installs the Node.js integration in the current working process.cwd().directory
 */
export async function installNode(pkg: { [key: string]: any }, dir: string) {
  const cwd = process.cwd()

  const { pushApiKey, name } = await inquirer.prompt([
    {
      type: "input",
      name: "pushApiKey",
      message: "What's your Push API Key?",
      validate: validateApiKey
    },
    {
      type: "input",
      name: "name",
      message: "What should we call your application?",
      default: "My App"
    }
  ])

  // detect if user is using yarn
  const isUsingYarn = existsSync(`${cwd}/yarn.lock`)

  const modules = Object.keys(pkg.dependencies || {})
    .map(dep => SUPPORTED_NODEJS_INTEGRATIONS[dep])
    .filter(dep => dep)

  console.log() // blank line

  if (modules.length > 0) {
    console.log(
      `We found ${chalk.cyan(modules.length)} integration${
        modules.length !== 1 ? "s" : ""
      } for the modules that you currently have installed:`
    )

    console.log() // blank line

    modules.forEach(mod => console.log(`${mod}`))
  } else {
    console.log(
      "We couldn't find any integrations for the modules you currently have installed."
    )
  }

  console.log() // blank line

  const { shouldInstallNow } = await inquirer.prompt([
    {
      type: "confirm",
      name: "shouldInstallNow",
      message:
        modules.length > 0
          ? "Do you want to install these now?"
          : "Continue installing just the core @appsignal/nodejs package?",
      default: true
    }
  ])

  console.log() // blank line

  modules.unshift("@appsignal/nodejs")

  if (shouldInstallNow) {
    if (isUsingYarn) {
      // using yarn
      spawnSync("yarn", ["add", ...modules], {
        cwd,
        stdio: "inherit"
      })
    } else {
      // using npm
      spawnSync("npm", ["install", "--save", ...modules], {
        cwd,
        stdio: "inherit"
      })
    }

    const { method } = await inquirer.prompt([
      {
        type: "list",
        name: "method",
        message:
          "Which method of configuring AppSignal in your project do you prefer?",
        choices: [
          "Using an appsignal.js configuration file.",
          "Using system environment variables."
        ],
        default: "Using an appsignal.js configuration file."
      }
    ])

    if (method == "Using an appsignal.js configuration file.") {
      console.log("Writing appsignal.js configuration file.")
      // console.log(path.join(dir, "appsignal.js"))
      fs.writeFileSync(
        path.join(dir, "appsignal.js"),
        `const { Appsignal } = require("@appsignal/nodejs");

const appsignal = new Appsignal({
  active: true,
  name: "${name}",
  pushApiKey: "${pushApiKey}",
});

module.exports = { appsignal };`
      )
    }

    // send a demo sample
    spawnDemo({
      APPSIGNAL_APP_ENV: "development",
      APPSIGNAL_APP_NAME: name,
      APPSIGNAL_PUSH_API_KEY: pushApiKey
    })
  } else {
    const mods = modules.join(" ")

    console.log(
      `👍 OK! We won't install anything right now. You can add these packages later by running:`
    )

    console.log() // blank line

    console.log(
      chalk.bold(
        isUsingYarn ? `yarn add ${mods}` : `npm install --save ${mods}`
      )
    )
  }

  console.log(
    `
🎉 ${chalk.greenBright(
      "Great news!"
    )} You've just installed AppSignal to your project!

The next step is adding your Push API key to your project. The best way to do this is with an environment variable:

${chalk.bold(`export APPSIGNAL_PUSH_API_KEY="${pushApiKey}"`)}

If you're using a cloud provider such as Heroku etc., seperate instructions on how to add these environment variables are available in our documentation:

🔗 https://docs.appsignal.com/nodejs/configuration

Then, you'll need to initalize AppSignal in your app. Please ensure that this is done in the entrypoint of your application, ${chalk.cyan(
      "before all other dependencies are imported!"
    )}

${chalk.bold(`const { Appsignal } = require("@appsignal/nodejs");

const appsignal = new Appsignal({
  active: true,
  name: "${name}"
});`)}

Some integrations require additional setup. See https://docs.appsignal.com/nodejs/integrations/ for more information.

Need any further help? Feel free to ask a human at ${chalk.bold(
      "support@appsignal.com"
    )}!
`
  )
}

/**
 * Validates the answer from Inquirer.js to validate the Push API key that is
 * asked for in question one
 */
async function validateApiKey(pushApiKey: string) {
  try {
    const validated = await validatePushApiKey({ apiKey: pushApiKey })

    if (validated === true) {
      return validated
    } else {
      return "Oops, looks like that wasn't a valid Push API key! Please try again."
    }
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}
