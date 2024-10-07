/**
 * Usage: @appsignal/cli install [options]
 *
 * installs AppSignal
 *
 * Options:
 * -h, --help  display help for command
 * @deprecated
 */
export async function install() {
  try {
    console.log(
      "CLI installer is deprecated. Please use the web wizard in this link: https://appsignal.com/redirect-to/organization?to=sites/new"
    )
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
