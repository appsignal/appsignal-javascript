import { Transaction as AppsignalTxn } from "./types/transaction"

export class Transaction {
  private _txn: AppsignalTxn

  constructor(txn: Partial<AppsignalTxn>) {
    this._txn = {
      timestamp: Math.round(new Date().getTime() / 1000),
      namespace: "frontend",
      error: {
        name: ""
      },
      environment: {},
      tags: {},
      ...txn
    }
  }

  public setAction(name: string) {
    this._txn.action = name
  }

  public setNamespace(name: string) {
    this._txn.namespace = name
  }

  public setError(error: Error) {
    const { name, message, stack = "" } = error

    this._txn.error = {
      name,
      message,
      backtrace: stack.split("\n").filter(line => line !== "")
    }
  }

  public setTags(tags: object) {
    this._txn.tags = { ...this._txn.tags, ...tags }
  }

  public toJSON(): string {
    return JSON.stringify(this._txn)
  }
}
