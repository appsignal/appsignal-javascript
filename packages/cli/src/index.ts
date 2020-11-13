import commander, { Command } from "commander"

import { install } from "./commands/install"
import { diagnose } from "./commands/diagnose"

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
      .option(
        "--no-report",
        "Don't send report automatically send the report to AppSignal"
      )
      .action(diagnose)

    this.cmd.parse(process.argv)

    return this
  }
}
