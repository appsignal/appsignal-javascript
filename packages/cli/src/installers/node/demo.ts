/**
 * Spawns a new Node process, divorced from the parent process, that exits quietly
 * after 90 seconds to allow the agent time to post a payload
 */

const {
  Appsignal
} = require(`${process.cwd()}/node_modules/@appsignal/nodejs/dist`)

const appsignal = new Appsignal({ active: true })
const tracer = appsignal.tracer()

function createPerformanceSample() {
  // @TODO: fix up `any` type
  tracer.withSpan(tracer.createSpan(), (span: any) => {
    span
      .setName("GET /demo")
      .setCategory("process_request.http")
      .set("demo_sample", true)
      .setSampleData("environment", { method: "GET", request_path: "/demo" })

    tracer.withSpan(span.child(), (child: any) => {
      child.setCategory("query.mongodb")
      setTimeout(() => child.close(), 50)
    })

    setTimeout(() => span.close(), 100)
  })
}

function createErrorSample() {
  // @TODO: fix up `any` type
  tracer.withSpan(tracer.createSpan(), (span: any) => {
    span
      .setName("GET /demo")
      .setCategory("process_request.http")
      .addError(
        new Error(
          "Hello world! This is an error used for demonstration purposes."
        )
      )
      .close()
  })
}

try {
  createPerformanceSample()
  createErrorSample()

  // cull the process automatically after 90 secs
  setTimeout(() => process.exit(0), 90 * 1000)
} catch (e) {
  process.exit(1)
}
