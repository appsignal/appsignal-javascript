import chalk from "chalk"
import inquirer from "inquirer"
import { validatePushApiKey } from "@appsignal/core"
import { spawnDemo } from "../../commands/demo"

/**
 * This is the very last thing to be displayed by the installer CLI! The
 * indendation is intentional, due to JavaScripts handling of multi-line
 * strings
 */
const displayOutroMessage = (pushApiKey: string, name: string) => `
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

Need any further help? Feel free to ask a human at ${chalk.bold(
  "support@appsignal.com"
)}!
`

/**
 * Installs the Node.js integration in the current working directory
 */
export async function installNode(pkg: { [key: string]: any }) {
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

  console.log() // Blank line

  console.log("Sending a demo sample to AppSignal...")
  spawnDemo({
    APPSIGNAL_APP_ENV: "development",
    APPSIGNAL_APP_NAME: name,
    APPSIGNAL_PUSH_API_KEY: pushApiKey
  })

  console.log(displayOutroMessage(pushApiKey, name))
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
