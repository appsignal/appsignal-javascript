import { existsSync } from "fs"
import { spawnSync } from "child_process"
import chalk from "chalk"
import inquirer from "inquirer"

import { SUPPORTED_NODEJS_INTEGRATIONS } from "../constants"

export async function installNode(pkg: { [key: string]: any }) {
  const { apiKey } = await inquirer.prompt([
    {
      type: "input",
      name: "apiKey",
      message: "What's your Push API Key?"
    }
  ])

  console.log() // blank line

  console.log("Checking to see if your Push API key is valid...")

  // detect if user is using yarn
  const isUsingYarn = existsSync(`${process.cwd()}/yarn.lock`)

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
        cwd: process.cwd(),
        stdio: "inherit"
      })
    } else {
      // using npm
      spawnSync("npm", ["install", "--save", ...modules], {
        cwd: process.cwd(),
        stdio: "inherit"
      })
    }
  } else {
    console.log(`OK! We won't install anything right now.`)

    console.log(
      `You can add these packages later by running:`,
      chalk.bold(
        isUsingYarn
          ? `yarn add ${modules.join(" ")}`
          : `npm install --save ${modules.join(" ")}`
      )
    )
  }

  console.log() // blank line

  console.log(`🎉 Great news! You've just installed AppSignal to your project!`)

  console.log() // blank line

  console.log(
    `The next step is adding your Push API key to your project. The best way to do this is with an environment variable:`
  )

  console.log() // blank line

  console.log(chalk.bold(`export APPSIGNAL_PUSH_API_KEY="${apiKey}"`))

  console.log() // blank line

  console.log(
    `If you're using a cloud provider such as Heroku etc., seperate instructions on how to add these environment variables are available in our documentation:`
  )

  console.log() // blank line

  console.log(`https://docs.appsignal.com/nodejs/configuration`)

  console.log() // blank line

  console.log(
    `Then, you'll need to initalize AppSignal in your app. Please ensure that this is done in the entrypoint of your application, ${chalk.cyan(
      "before all other dependencies are imported!"
    )}`
  )

  console.log() // blank line

  console.log(
    chalk.bold(
      `const { Appsignal } = require("@appsignal/nodejs");\n\nconst appsignal = new Appsignal({\n  active: true, \n  name: "<YOUR APPLICATION NAME>"\n});`
    )
  )

  console.log() // blank line

  console.log(
    `Some integrations require additional setup. See https://docs.appsignal.com/nodejs/integrations/ for more information.`
  )

  console.log() // blank line

  console.log(
    `Need any further help? Feel free to ask a human at ${chalk.bold(
      "support@appsignal.com"
    )}!`
  )
}