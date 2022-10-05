jest.mock("inquirer")

import * as os from "os"
import * as fs from "fs"
import * as path from "path"
import inquirer from "inquirer"
import { installNode } from "../installers/node"

const consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {})
const mockedPrompt = inquirer.prompt as jest.MockedFunction<
  typeof inquirer.prompt
>
const pkg = require(`${process.cwd()}/package.json`)
const tmpdir = os.tmpdir()

describe("Installer", () => {
  it("prints install instructions", async () => {
    mockedPrompt.mockResolvedValueOnce({
      pushApiKey: "00000000-0000-0000-0000-000000000000",
      name: "MyApp"
    })
    mockedPrompt.mockResolvedValueOnce({ shouldInstallNow: true })
    mockedPrompt.mockResolvedValueOnce({
      method: "Using an appsignal.js configuration file."
    })

    await installNode(pkg, tmpdir)

    expect(consoleLogSpy.mock.calls).toEqual([
      [],
      [
        "We couldn't find any integrations for the modules you currently have installed."
      ],
      [],
      [],
      ["Writing appsignal.js configuration file."],
      [],
      ["📡 Demonstration sample data sent!"],
      [],
      [
        "It may take a minute for the data to appear on https://appsignal.com/accounts"
      ],
      [
        `
🎉 Great news! You've just installed AppSignal to your project!

The next step is adding your Push API key to your project. The best way to do this is with an environment variable:

export APPSIGNAL_PUSH_API_KEY="00000000-0000-0000-0000-000000000000"

If you're using a cloud provider such as Heroku etc., seperate instructions on how to add these environment variables are available in our documentation:

🔗 https://docs.appsignal.com/nodejs/configuration

Then, you'll need to initalize AppSignal in your app. Please ensure that this is done in the entrypoint of your application, before all other dependencies are imported!

const { Appsignal } = require(\"@appsignal/nodejs\");

const appsignal = new Appsignal({
  active: true,
  name: \"MyApp\"
});

Some integrations require additional setup. See https://docs.appsignal.com/nodejs/integrations/ for more information.

Need any further help? Feel free to ask a human at support@appsignal.com!
`
      ]
    ])

    expect(
      fs.readFileSync(path.join(tmpdir, "appsignal.js")).toString()
    ).toEqual(
      `const { Appsignal } = require("@appsignal/nodejs");

const appsignal = new Appsignal({
  active: true,
  name: "MyApp",
  pushApiKey: "00000000-0000-0000-0000-000000000000",
});

module.exports = { appsignal };`
    )
  })
})
