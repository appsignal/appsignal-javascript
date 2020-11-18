import axios, { AxiosInstance } from "axios"
import { Compilation, Compiler, Stats, WebpackPluginInstance } from "webpack"
import FormData from "form-data"
import fs from "fs/promises"
import path from "path"

/**
 * This plugin borrows heavily from https://github.com/40thieves/webpack-sentry-plugin
 * We thank the original author(s) for their work!
 */

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
      timeout = 5000,
      endpoint = "https://appsignal.com/api"
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
      baseURL: endpoint,
      timeout,
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
    const files = this.getFiles(compilation)

    if (files.length === 0) return

    try {
      const forms = await Promise.all(
        files.map(file => this.createForm(file!.name, release, file!.filePath))
      )

      console.log(forms)
      // await Promise.all(forms.map(form => this.upload(form)))
    } catch (error) {
      throw new Error(`AppSignal Plugin: ${error}`)
    }
  }

  private onDone = async ({ compilation }: Stats) => {
    if (this.options.deleteAfterCompile) {
      await this.deleteFiles(compilation)
    }
  }

  private getFiles(compilation: Compilation) {
    const { assets, compiler } = compilation

    return Object.keys(assets)
      .map(name => {
        const filePath = path.join(
          compilation.getPath(compiler.outputPath),
          name.split("?")[0]
        )

        if (/\.js$|\.map$/.test(name)) {
          return { name, filePath }
        } else {
          return null
        }
      })
      .filter(el => el)
  }

  private async createForm(
    name: string,
    revision: string,
    filePath: string
  ): Promise<FormData> {
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

    const file = await fs.readFile(filePath)

    form.append("revision", revision)
    form.append("file", file)

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
          return fs.unlink(filePath)
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
