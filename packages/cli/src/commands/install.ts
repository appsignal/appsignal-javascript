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
  console.log("🚀 Alright! Let's install AppSignal to your project!")

  try {
    await installNode(process.cwd())
    console.log("✅ Done!")
    return
  } catch (error) {
    if (error instanceof Error) {
      console.warn(
        "Prompt couldn't be rendered in the current environment, exiting..."
      )
    }

    throw error
  }
}
