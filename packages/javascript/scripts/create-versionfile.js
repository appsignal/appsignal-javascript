#!/usr/bin/env node

const fs = require("fs")

const pkg = require("../package.json")
const data = `export const VERSION = "${pkg.version}"`

fs.writeFile(`${process.cwd()}/src/version.ts`, data, "utf8", err => {
  if (err) throw err
  console.log("The file has been saved!")
  process.exit(0)
})
