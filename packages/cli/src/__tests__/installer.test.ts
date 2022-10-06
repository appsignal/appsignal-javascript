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
  describe("when choosing to install with a configuration file", () => {
    beforeAll(async () => {
      mockedPrompt.mockResolvedValueOnce({
        pushApiKey: "00000000-0000-0000-0000-000000000000",
        name: "MyApp"
      })
      mockedPrompt.mockResolvedValueOnce({ shouldInstallNow: true })
      mockedPrompt.mockResolvedValueOnce({
        method: "Using an appsignal.js configuration file."
      })

      await installNode(pkg, tmpdir)
    })

    it("it prints the post-install instructions", () => {
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
        [],
        ["Writing appsignal.js configuration file."],
        [],
        [`🎉 Great news! You've just installed AppSignal to your project!`],
        [],
        [
          `Now, you can run your application like you normally would, but use the --require flag to load AppSignal's instrumentation before any other library:

    node --require './appsignal.js' index.js`
        ],
        [],
        [
          `Some integrations require additional setup. See https://docs.appsignal.com/nodejs/integrations/ for more information.

Need any further help? Feel free to ask a human at support@appsignal.com!`
        ]
      ])
    })

    it("it writes an appsignal.js configuration file", () => {
      expect(fs.readFileSync(path.join(tmpdir, "appsignal.js")).toString())
        .toEqual(`const { Appsignal } = require("@appsignal/nodejs");

const appsignal = new Appsignal({
  active: true,
  name: "MyApp",
  pushApiKey: "00000000-0000-0000-0000-000000000000",
});

module.exports = { appsignal };`)
    })
  })
})
