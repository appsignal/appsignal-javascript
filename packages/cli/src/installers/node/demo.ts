/**
 * Spawns a new Node process, divorced from the parent process, that exits quietly
 * after 90 seconds to allow the agent time to post a payload
 */

const {
  Appsignal
} = require(`${process.cwd()}/node_modules/@appsignal/nodejs/dist`)

const appsignal = new Appsignal({ active: true })

try {
  appsignal.demo()

  // cull the process automatically after 90 secs
  setTimeout(() => process.exit(0), 90 * 1000)
} catch (e) {
  process.exit(1)
}
