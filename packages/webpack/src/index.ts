import axios, { AxiosInstance } from "axios"
import { compilation, Compiler, Plugin, Stats } from "webpack"
import FormData from "form-data"
import fs from "fs"

type Compilation = compilation.Compilation

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

class AppsignalPlugin implements Plugin {
  public name = "AppsignalPlugin"
  public options: PluginOptions

  private _request: AxiosInstance

  constructor(options: PluginOptions) {
    this._request = axios.create({
      baseURL: options.endpoint || "https://appsignal.com/api",
      timeout: options.timeout || 5000
    })

    this.options = options
  }

  public apply(compiler: Compiler) {
    const { afterEmit, done } = compiler.hooks

    afterEmit.tapPromise(this.name, this.onAfterEmit)
    done.tapPromise(this.name, this.onDone)
  }

  private onAfterEmit = async (compilation: Compilation) => {
    const { assets } = compilation
    const { release } = this.options

    const script = this.getAssetOfType(/\.js$/, assets)
    const sourcemap = this.getAssetOfType(/\.map$/, assets)

    if (!script || !sourcemap) return

    try {
      const form = this.createForm(script.name, release, sourcemap.filePath)
      await this.upload(form)
    } catch (error) {
      compilation.errors.push(`AppSignal Plugin: ${error}`)
    }
  }

  private onDone = async (stats: Stats) => {
    const { assets } = stats.compilation

    if (this.options.deleteAfterCompile) {
      await this.deleteFiles(assets)
    }
  }

  private getAssetOfType(rx: RegExp, assets: any): Asset {
    return Object.keys(assets)
      .map(name => {
        if (rx.test(name)) {
          return { name, filePath: assets[name].existsAt }
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

    const _appendName = (url: string) =>
      form.append("name[]", `${url.replace(/\/$/, "")}/${name}`)

    if (Array.isArray(urlRoot)) {
      urlRoot.forEach(url => _appendName(url))
    } else {
      _appendName(urlRoot)
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

  private async deleteFiles(assets: any) {
    const promises = Object.keys(assets)
      .filter(name => /\.map$/.test(name))
      .map(name => {
        const filePath = assets[name].existsAt

        if (filePath) {
          return fs.promises.unlink(filePath)
        } else {
          console.warn(`
            ⚠️ [AppsignalPlugin]: unable to delete '${name}' 
            File does not exist. it may not have been created
            due to a build error.
          `)
        }
      })
      .filter(el => el)

    return Promise.all(promises)
  }
}

export { AppsignalPlugin }
