import inquirer from "inquirer"
import { installNode } from "../installers/node"

/**
 * Usage: @appsignal/cli install [options]
 *
 * installs AppSignal
 *
 * Options:
 * -h, --help  display help for command
 */
export async function install() {
  let pkg: { [key: string]: any }

  console.log("🚀 Alright! Let's install AppSignal to your project!")

  try {
    console.log("🔭 Checking for your package.json...")
    pkg = require(`${process.cwd()}/package.json`)

    console.log("✅ Found it!")
  } catch (e) {
    console.error(
      "Couldn't find a package.json in your current working directory"
    )

    throw e
  }

  try {
    const { integration } = await inquirer.prompt([
      {
        type: "list",
        name: "integration",
        message: "Which integration do you need?",
        choices: [
          "Node.js",
          {
            name: "Browser",
            disabled: "Unavailable at this time"
          }
        ],
        filter: val => val.toLowerCase().split(".").join("")
      }
    ])

    if (integration === "nodejs") {
      await installNode(pkg)
    }

    console.log("✅ Done!")
    return
  } catch (error) {
    if (error.isTtyError) {
      console.warn(
        "Prompt couldn't be rendered in the current environment, exiting..."
      )
    }

    throw error
  }
}
