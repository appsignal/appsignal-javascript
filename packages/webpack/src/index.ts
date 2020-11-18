import axios, { AxiosInstance } from "axios"
import { Compilation, Compiler, Stats, WebpackPluginInstance } from "webpack"
import FormData from "form-data"
import fs from "fs"
import path from "path"

type PluginOptions = {
  apiKey: string
  release: string
  appName: string
  environment: string
  urlRoot: string | string[]
  deleteAfterCompile?: boolean
  timeout?: number
  endpoint?: string
}

type Asset = {
  name: string
  filePath: string
}

export class AppsignalPlugin implements WebpackPluginInstance {
  public name = "AppsignalPlugin"
  public options: PluginOptions

  private _request: AxiosInstance

  constructor(options: PluginOptions) {
    const {
      apiKey,
      release,
      appName,
      environment,
      urlRoot,
      timeout,
      endpoint
    } = options

    if (!apiKey) {
      throw new Error("AppSignal Plugin: No `apiKey` provided to constructor.")
    } else if (!release) {
      throw new Error("AppSignal Plugin: No `release` provided to constructor.")
    } else if (!appName) {
      throw new Error("AppSignal Plugin: No `appName` provided to constructor.")
    } else if (!urlRoot) {
      throw new Error("AppSignal Plugin: No `urlRoot` provided to constructor.")
    }

    // set the default environment from NODE_ENV or fall back to "development"
    if (!environment) {
      options.environment = process.env.NODE_ENV || "development"
    }

    this._request = axios.create({
      baseURL: endpoint || "https://appsignal.com/api",
      timeout: timeout || 5000,
      maxBodyLength: Math.floor(16 * 1000000) // 16MB, the max allowed on the server
    })

    this.options = options
  }

  public apply(compiler: Compiler) {
    const { afterEmit, done } = compiler.hooks

    afterEmit.tapPromise(this.name, this.onAfterEmit)
    done.tapPromise(this.name, this.onDone)
  }

  private onAfterEmit = async (compilation: Compilation) => {
    const { release } = this.options

    const script = this.getAssetOfType(/\.js$/, compilation)
    const sourcemap = this.getAssetOfType(/\.map$/, compilation)

    if (!script || !sourcemap) return

    try {
      const form = this.createForm(script.name, release, sourcemap.filePath)
      console.log(form)
      // await this.upload(form)
    } catch (error) {
      throw new Error(`AppSignal Plugin: ${error}`)
    }
  }

  private onDone = async ({ compilation }: Stats) => {
    if (this.options.deleteAfterCompile) {
      await this.deleteFiles(compilation)
    }
  }

  private getAssetOfType(rx: RegExp, compilation: Compilation): Asset {
    const { assets, compiler } = compilation

    return Object.keys(assets)
      .map(name => {
        const filePath = path.join(
          compilation.getPath(compiler.outputPath),
          name.split("?")[0]
        )

        if (rx.test(name)) {
          return { name, filePath }
        }

        return null
      })
      .filter(el => el)[0] as Asset
  }

  private createForm(
    name: string,
    revision: string,
    filePath: string
  ): FormData {
    const form = new FormData()
    const { urlRoot } = this.options

    function appendName(url: string) {
      form.append("name[]", `${url.replace(/\/$/, "")}/${name}`)
    }

    if (Array.isArray(urlRoot)) {
      urlRoot.forEach(url => appendName(url))
    } else {
      appendName(urlRoot)
    }

    form.append("revision", revision)
    form.append("file", fs.readFileSync(filePath))

    return form
  }

  private async upload(form: FormData) {
    const { apiKey, appName, environment } = this.options

    return this._request.post("/sourcemaps", form.getBuffer(), {
      headers: form.getHeaders(),
      params: {
        push_api_key: apiKey,
        app_name: appName,
        environment
      }
    })
  }

  private async deleteFiles(compilation: Compilation) {
    const { assets, compiler } = compilation

    const promises = Object.keys(assets)
      .filter(name => /\.map$/.test(name))
      .map(name => {
        const filePath = path.join(
          compilation.getPath(compiler.outputPath),
          name.split("?")[0]
        )

        if (filePath) {
          return fs.promises.unlink(filePath)
        } else {
          console.warn(
            `⚠️ [AppsignalPlugin]: unable to delete '${name}. File does not exist. it may not have been created due to a build error.`
          )
        }
      })
      .filter(el => el)

    return Promise.all(promises)
  }
}
