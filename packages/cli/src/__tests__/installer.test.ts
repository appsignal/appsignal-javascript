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
        method: "Using an appsignal.cjs configuration file."
      })

      await installNode(tmpdir)
    })

    afterAll(() => {
      fs.rmSync(path.join(tmpdir, "appsignal.cjs"))
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
        ["Writing appsignal.cjs configuration file."],
        [],
        [`🎉 Great news! You've just installed AppSignal to your project!`],
        [],
        [
          `Now, you can run your application like you normally would, but use the --require flag to load AppSignal's instrumentation before any other library:`
        ],
        [],
        [`    node --require './appsignal.cjs' index.js`],
        [],
        [
          `Some integrations require additional setup. See https://docs.appsignal.com/nodejs/integrations/ for more information.

Need any further help? Feel free to ask a human at support@appsignal.com!`
        ]
      ])
    })

    it("it writes an appsignal.cjs configuration file", () => {
      expect(
        fs.readFileSync(path.join(tmpdir, "appsignal.cjs")).toString()
      ).toEqual(
        `const { Appsignal } = require("@appsignal/nodejs");\n\n` +
          `new Appsignal({\n` +
          `  active: true,\n` +
          `  name: "MyApp",\n` +
          `  pushApiKey: "00000000-0000-0000-0000-000000000000",\n` +
          `});\n`
      )
    })
  })

  describe("when choosing to install with a configuration file, but a file already exists", () => {
    beforeAll(async () => {
      mockedPrompt.mockResolvedValueOnce({
        pushApiKey: "00000000-0000-0000-0000-000000000000",
        name: "MyApp"
      })
      mockedPrompt.mockResolvedValueOnce({
        method: "Using an appsignal.cjs configuration file."
      })
      mockedPrompt.mockResolvedValueOnce({
        overwrite: false
      })

      fs.writeFileSync(
        path.join(tmpdir, "appsignal.cjs"),
        "// This file already exists"
      )
      await installNode(tmpdir)
    })

    afterAll(() => {
      fs.rmSync(path.join(tmpdir, "appsignal.cjs"))
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
        ["Not writing appsignal.cjs configuration file. Exiting."]
      ])
    })

    it("it does not write an appsignal.cjs configuration file", () => {
      expect(
        fs.readFileSync(path.join(tmpdir, "appsignal.cjs")).toString()
      ).toEqual(`// This file already exists`)
    })
  })

  describe("when choosing to install with a configuration file, a file already exists, but the user chooses to overwrite it", () => {
    beforeAll(async () => {
      mockedPrompt.mockResolvedValueOnce({
        pushApiKey: "00000000-0000-0000-0000-000000000000",
        name: "MyApp"
      })
      mockedPrompt.mockResolvedValueOnce({
        method: "Using an appsignal.cjs configuration file."
      })
      mockedPrompt.mockResolvedValueOnce({
        overwrite: true
      })

      fs.writeFileSync(
        path.join(tmpdir, "appsignal.cjs"),
        "// This file already exists"
      )
      await installNode(tmpdir)
    })

    afterAll(() => {
      fs.rmSync(path.join(tmpdir, "appsignal.cjs"))
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
        ["Writing appsignal.cjs configuration file."],
        [],
        [`🎉 Great news! You've just installed AppSignal to your project!`],
        [],
        [
          `Now, you can run your application like you normally would, but use the --require flag to load AppSignal's instrumentation before any other library:`
        ],
        [],
        [`    node --require './appsignal.cjs' index.js`],
        [],
        [
          `Some integrations require additional setup. See https://docs.appsignal.com/nodejs/integrations/ for more information.

Need any further help? Feel free to ask a human at support@appsignal.com!`
        ]
      ])
    })

    it("it writes an appsignal.cjs configuration file", () => {
      expect(
        fs.readFileSync(path.join(tmpdir, "appsignal.cjs")).toString()
      ).toEqual(
        `const { Appsignal } = require("@appsignal/nodejs");\n\n` +
          `new Appsignal({\n` +
          `  active: true,\n` +
          `  name: "MyApp",\n` +
          `  pushApiKey: "00000000-0000-0000-0000-000000000000",\n` +
          `});\n`
      )
    })
  })

  describe("when choosing to install with a configuration file, with a src directory", () => {
    beforeAll(async () => {
      mockedPrompt.mockResolvedValueOnce({
        pushApiKey: "00000000-0000-0000-0000-000000000000",
        name: "MyApp"
      })
      mockedPrompt.mockResolvedValueOnce({
        method: "Using an appsignal.cjs configuration file."
      })

      fs.mkdirSync(src)
      await installNode(tmpdir)
    })

    afterAll(() => {
      fs.rmSync(src, { recursive: true, force: true })
      jest.clearAllMocks()
    })

    it("it refers to src/appsignal.cjs the post-install instructions", () => {
      expect(consoleLogSpy.mock.calls).toContainEqual([
        "Writing src/appsignal.cjs configuration file."
      ])
      expect(consoleLogSpy.mock.calls).toContainEqual([
        "    node --require './src/appsignal.cjs' index.js"
      ])
    })

    it("it writes a src/appsignal.cjs configuration file", () => {
      expect(
        fs.readFileSync(path.join(src, "appsignal.cjs")).toString()
      ).toEqual(
        `const { Appsignal } = require("@appsignal/nodejs");\n\n` +
          `new Appsignal({\n` +
          `  active: true,\n` +
          `  name: "MyApp",\n` +
          `  pushApiKey: "00000000-0000-0000-0000-000000000000",\n` +
          `});\n`
      )
    })
  })

  describe("when choosing to install with a configuration file, with a src directory that's actually a file", () => {
    beforeAll(async () => {
      mockedPrompt.mockResolvedValueOnce({
        pushApiKey: "00000000-0000-0000-0000-000000000000",
        name: "MyApp"
      })
      mockedPrompt.mockResolvedValueOnce({
        method: "Using an appsignal.cjs configuration file."
      })

      fs.writeFileSync(src, "")
      await installNode(tmpdir)
    })

    afterAll(() => {
      fs.rmSync(path.join(tmpdir, "appsignal.cjs"))
      fs.rmSync(src, { recursive: true, force: true })
      jest.clearAllMocks()
    })

    it("it refers to appsignal.cjs the post-install instructions", () => {
      expect(consoleLogSpy.mock.calls).toContainEqual([
        "Writing appsignal.cjs configuration file."
      ])
      expect(consoleLogSpy.mock.calls).toContainEqual([
        "    node --require './appsignal.cjs' index.js"
      ])
    })

    it("it writes an appsignal.cjs configuration file", () => {
      expect(
        fs.readFileSync(path.join(tmpdir, "appsignal.cjs")).toString()
      ).toEqual(
        `const { Appsignal } = require("@appsignal/nodejs");\n\n` +
          `new Appsignal({\n` +
          `  active: true,\n` +
          `  name: "MyApp",\n` +
          `  pushApiKey: "00000000-0000-0000-0000-000000000000",\n` +
          `});\n`
      )
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

      await installNode(tmpdir)
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
        ["Writing appsignal.cjs configuration file."],
        [],
        [`🎉 Great news! You've just installed AppSignal to your project!`],
        [],
        [
          `Now, you can run your application like you normally would, but use the --require flag to load AppSignal's instrumentation before any other library:`
        ],
        [],
        [`    node --require './appsignal.cjs' index.js`],
        [],
        [
          `You've chosen to use environment variables to configure AppSignal:

    export APPSIGNAL_PUSH_API_KEY="00000000-0000-0000-0000-000000000000"

If you're using a cloud provider such as Heroku etc., seperate instructions on how to add these environment variables are available in our documentation:

 🔗 https://docs.appsignal.com/nodejs/configuration`
        ],
        [],
        [
          `Some integrations require additional setup. See https://docs.appsignal.com/nodejs/integrations/ for more information.

Need any further help? Feel free to ask a human at support@appsignal.com!`
        ]
      ])
    })

    it("it writes an appsignal.cjs configuration file", () => {
      expect(
        fs.readFileSync(path.join(tmpdir, "appsignal.cjs")).toString()
      ).toEqual(
        `const { Appsignal } = require("@appsignal/nodejs");\n\n` +
          `new Appsignal({\n` +
          `  active: true,\n` +
          `  name: "MyApp",\n` +
          `});\n`
      )
    })
  })
})
