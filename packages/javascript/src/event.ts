import ErrorStackParser from "error-stack-parser"
import { Event as AppsignalEvent } from "./types/event"

export class Event {
  private _data: AppsignalEvent

  constructor(event: Partial<AppsignalEvent>) {
    this._data = {
      timestamp: Math.round(new Date().getTime() / 1000),
      namespace: "frontend",
      error: {
        name: ""
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
      message
    }

    if (error instanceof Error) {
      try {
        const frames = ErrorStackParser.parse(error)
        this._data.error.backtrace = frames.map(f => f.source || "")
      } catch (e) {
        // probably IE9 or another browser where we can't get a stack
        this._data.error.backtrace = ["No stacktrace available"]
      }
    } else {
      // a plain object that resembles an error
      const { stack = "" } = error
      this._data.error.backtrace = stack.split("\n").filter(line => line !== "")
    }
  }

  public setTags(tags: object) {
    this._data.tags = { ...this._data.tags, ...tags }
  }

  public toJSON(): string {
    return JSON.stringify(this._data)
  }
}
