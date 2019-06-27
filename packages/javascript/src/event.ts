import { getStacktrace } from "./utils/stacktrace"
import { Event as AppsignalEvent } from "./types/event"

export class Event {
  private _data: AppsignalEvent

  constructor(event: Partial<AppsignalEvent>) {
    this._data = {
      timestamp: Math.round(new Date().getTime() / 1000),
      namespace: "frontend",
      error: {
        name: "",
        message: "",
        backtrace: []
      },
      environment: {},
      tags: {},
      ...event
    }
  }

  public setAction(name: string) {
    this._data.action = name
  }

  public setNamespace(name: string) {
    this._data.namespace = name
  }

  public setError<T extends Error>(error: Error | T) {
    const { name, message } = error

    this._data.error = {
      name,
      message,
      backtrace: getStacktrace(error)
    }
  }

  public setTags(tags: object) {
    this._data.tags = { ...this._data.tags, ...tags }
  }

  public toJSON(): string {
    return JSON.stringify(this._data)
  }
}
