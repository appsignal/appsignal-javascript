import { existsSync } from "fs"
import { spawnSync, spawn } from "child_process"
import chalk from "chalk"
import inquirer from "inquirer"

import { SUPPORTED_NODEJS_INTEGRATIONS } from "../../constants"
import { validate } from "../../utils"

/**
 * This is the very last thing to be displayed by the installer CLI! The
 * indendation is intentional, due to JavaScripts handling of multi-line
 * strings
 */
const displayOutroMessage = (apiKey: string, name: string) => `
🎉 ${chalk.greenBright(
  "Great news!"
)} You've just installed AppSignal to your project!

The next step is adding your Push API key to your project. The best way to do this is with an environment variable:

${chalk.bold(`export APPSIGNAL_PUSH_API_KEY="${apiKey}"`)}

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

/**
 * Installs the Node.js integration in the current working directory
 */
export async function installNode(pkg: { [key: string]: any }) {
  const cwd = process.cwd()

  const { apiKey, name } = await inquirer.prompt([
    {
      type: "input",
      name: "apiKey",
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

  const modules = Object.keys(pkg.dependencies)
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

    // send a demo sample
    spawn("node", [`${__dirname}/demo.js`], {
      cwd,
      detached: true,
      env: {
        ...process.env,
        APPSIGNAL_APP_ENV: "development",
        APPSIGNAL_APP_NAME: name,
        APPSIGNAL_PUSH_API_KEY: apiKey
      },
      stdio: "ignore"
    }).unref()

    console.log() // blank line

    console.log(chalk.greenBright("📡 Demonstration sample data sent!"))

    console.log() // blank line

    console.log(
      "It may take a minute for the data to appear on https://appsignal.com/accounts"
    )
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

  console.log(displayOutroMessage(apiKey, name))
}

/**
 * Validates the answer from Inquirer.js to validate the Push API key that is
 * asked for in question one
 */
async function validateApiKey(apiKey: string) {
  try {
    const validated = await validate({ apiKey })

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
