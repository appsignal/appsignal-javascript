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
let src = path.join(tmpdir, "src")

describe("Installer", () => {
  describe("when choosing to install with a configuration file", () => {
    beforeAll(async () => {
      mockedPrompt.mockResolvedValueOnce({
        pushApiKey: "00000000-0000-0000-0000-000000000000",
        name: "MyApp"
      })
      mockedPrompt.mockResolvedValueOnce({
        method: "Using an appsignal.js configuration file."
      })

      await installNode(pkg, tmpdir)
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("it prints the post-install instructions", () => {
      expect(consoleLogSpy.mock.calls).toEqual([
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
          `Now, you can run your application like you normally would, but use the --require flag to load AppSignal's instrumentation before any other library:`
        ],
        [],
        [`    node --require './appsignal.js' index.js`],
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

  describe("when choosing to install with a configuration file, with a src directory", () => {
    beforeAll(async () => {
      mockedPrompt.mockResolvedValueOnce({
        pushApiKey: "00000000-0000-0000-0000-000000000000",
        name: "MyApp"
      })
      mockedPrompt.mockResolvedValueOnce({
        method: "Using an appsignal.js configuration file."
      })

      fs.mkdirSync(src)
      await installNode(pkg, tmpdir)
    })

    afterAll(() => {
      fs.rmSync(src, { recursive: true, force: true })
      jest.clearAllMocks()
    })

    it("it refers to src/appsignal.js the post-install instructions", () => {
      expect(consoleLogSpy.mock.calls).toContainEqual([
        "Writing src/appsignal.js configuration file."
      ])
      expect(consoleLogSpy.mock.calls).toContainEqual([
        "    node --require './src/appsignal.js' index.js"
      ])
    })

    it("it writes a src/appsignal.js configuration file", () => {
      expect(fs.readFileSync(path.join(src, "appsignal.js")).toString())
        .toEqual(`const { Appsignal } = require("@appsignal/nodejs");

const appsignal = new Appsignal({
  active: true,
  name: "MyApp",
  pushApiKey: "00000000-0000-0000-0000-000000000000",
});

module.exports = { appsignal };`)
    })
  })

  describe("when choosing to install with a configuration file, with a src directory that's actually a file", () => {
    beforeAll(async () => {
      mockedPrompt.mockResolvedValueOnce({
        pushApiKey: "00000000-0000-0000-0000-000000000000",
        name: "MyApp"
      })
      mockedPrompt.mockResolvedValueOnce({
        method: "Using an appsignal.js configuration file."
      })

      fs.writeFileSync(src, "")
      await installNode(pkg, tmpdir)
    })

    afterAll(() => {
      fs.rmSync(src, { recursive: true, force: true })
      jest.clearAllMocks()
    })

    it("it refers to appsignal.js the post-install instructions", () => {
      expect(consoleLogSpy.mock.calls).toContainEqual([
        "Writing appsignal.js configuration file."
      ])
      expect(consoleLogSpy.mock.calls).toContainEqual([
        "    node --require './appsignal.js' index.js"
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

  describe("when choosing to install with environment variables", () => {
    beforeAll(async () => {
      mockedPrompt.mockResolvedValueOnce({
        pushApiKey: "00000000-0000-0000-0000-000000000000",
        name: "MyApp"
      })
      mockedPrompt.mockResolvedValueOnce({
        method: "Using system environment variables."
      })

      await installNode(pkg, tmpdir)
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("it prints the post-install instructions", () => {
      expect(consoleLogSpy.mock.calls).toEqual([
        [],
        ["📡 Demonstration sample data sent!"],
        [],
        [
          "It may take a minute for the data to appear on https://appsignal.com/accounts"
        ],
        [],
        [`🎉 Great news! You've just installed AppSignal to your project!`],
        [],
        [
          `You've chosen to use environment variables to configure AppSignal:

    export APPSIGNAL_PUSH_API_KEY="00000000-0000-0000-0000-000000000000"

If you're using a cloud provider such as Heroku etc., seperate instructions on how to add these environment variables are available in our documentation:

 🔗 https://docs.appsignal.com/nodejs/configuration

Then, you'll need to initalize AppSignal in your app. Please ensure that this is done in the entrypoint of your application, before all other dependencies are imported!

    const { Appsignal } = require(\"@appsignal/nodejs\");
    
    const appsignal = new Appsignal({
      active: true,
      name: \"MyApp\"
    });`
        ],
        [],
        [
          `Some integrations require additional setup. See https://docs.appsignal.com/nodejs/integrations/ for more information.

Need any further help? Feel free to ask a human at support@appsignal.com!`
        ]
      ])
    })
  })
})
