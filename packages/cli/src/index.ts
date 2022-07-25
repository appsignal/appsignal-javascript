import commander, { Command } from "commander"

import { install } from "./commands/install"
import { diagnose } from "./commands/diagnose"
import { demo } from "./commands/demo"

export class CLI {
  private cmd: commander.Command

  constructor({ name, version }: { name: string; version: string }) {
    this.cmd = new Command(name).version(version)
  }

  public run() {
    this.cmd
      .command("install")
      .description("installs AppSignal")
      .action(install)

    this.cmd
      .command("diagnose")
      .description("runs the diagnose command (Node.js integration only)")
      .option("-e, --environment <env>", "Which environment to use")
      .option("-k, --api-key <key>", "Which API key to use")
      .option("--send-report", "Automatically send the report to AppSignal")
      .option(
        "--no-send-report",
        "Don't send the report automatically to AppSignal"
      )
      .action(diagnose)

    this.cmd
      .command("demo")
      .description("sends demonstration sample data to AppSignal")
      .option("-e, --environment <env>", "Which environment to use")
      .option("-a, --application <name>", "Which application name to use")
      .option("-k, --api-key <key>", "Which API key to use")
      .action(demo)

    this.cmd.parse(process.argv)

    return this
  }
}
