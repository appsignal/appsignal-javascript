jest.mock("inquirer")

import inquirer from "inquirer"
import { installNode } from "../installers/node"

const consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {})
const mockedPrompt = inquirer.prompt as jest.MockedFunction<
  typeof inquirer.prompt
>
const pkg = require(`${process.cwd()}/package.json`)

describe("Installer", () => {
  it("prints install instructions", async () => {
    mockedPrompt.mockResolvedValueOnce({ pushApiKey: "123", name: "name" })
    mockedPrompt.mockResolvedValueOnce({ shouldInstallNow: true })

    await installNode(pkg)

    expect(consoleLogSpy.mock.calls).toEqual([
      [],
      [
        "We couldn't find any integrations for the modules you currently have installed."
      ],
      [],
      [],
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

export APPSIGNAL_PUSH_API_KEY="123"

If you're using a cloud provider such as Heroku etc., seperate instructions on how to add these environment variables are available in our documentation:

🔗 https://docs.appsignal.com/nodejs/configuration

Then, you'll need to initalize AppSignal in your app. Please ensure that this is done in the entrypoint of your application, before all other dependencies are imported!

const { Appsignal } = require(\"@appsignal/nodejs\");

const appsignal = new Appsignal({
  active: true,
  name: \"name\"
});

Some integrations require additional setup. See https://docs.appsignal.com/nodejs/integrations/ for more information.

Need any further help? Feel free to ask a human at support@appsignal.com!
`
      ]
    ])
  })
})
