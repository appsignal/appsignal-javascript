import type Appsignal from "@appsignal/javascript"
import {
  type ErrorHandler,
  inject,
  Injectable,
  ɵisPromise as isPromise,
  NgZone
} from "@angular/core"
import { defer, of } from "rxjs"
import { shareReplay } from "rxjs/operators"

// Sync factory: returns an Appsignal instance directly.
type AppsignalFactory = () => Appsignal
// Async loader: returns a Promise, enabling lazy/dynamic import of the Appsignal bundle.
type AppsignalLoader = () => Promise<Appsignal>
// Accepts either form so the consumer can choose between eager and lazy initialization.
type AppsignalFactoryOrLoader = AppsignalFactory | AppsignalLoader

@Injectable()
export class AppsignalErrorHandler implements ErrorHandler {
  // Deferred observable that resolves the Appsignal instance on first subscription
  // (i.e. on the first error) and replays the result to all subsequent subscribers,
  // so the factory/loader is invoked exactly once regardless of how many errors occur.
  private readonly _appsignal$ = defer(() => {
    const appsignalOrPromise = this._appSignalFactory()
    // Normalise both sync and async return values into an observable.
    return isPromise(appsignalOrPromise)
      ? appsignalOrPromise
      : of(appsignalOrPromise)
  }).pipe(shareReplay({ bufferSize: 1, refCount: false }))

  constructor(
    private readonly _ngZone: NgZone,
    // The factory/loader is injected rather than an Appsignal instance directly,
    // keeping Appsignal out of the bundle until the first error is actually handled.
    private readonly _appSignalFactory: AppsignalFactoryOrLoader
  ) {}

  public handleError(error: any): void {
    // Run outside Angular's zone to avoid triggering unnecessary change detection
    // while waiting for the Appsignal instance to resolve.
    this._ngZone.runOutsideAngular(() => {
      this._appsignal$.subscribe(appSignal => {
        const span = appSignal.createSpan()

        span.setError(error).setTags({ framework: "Angular" })

        appSignal.send(span)
      })
    })
  }
}

// Wraps the factory/loader in an Angular-compatible provider factory,
// so consumers can pass their own lazy import (e.g. `() => import("@appsignal/javascript")`)
// and Appsignal will only be loaded when the first error is caught.
export function createErrorHandlerFactory(
  appsignalFactory: AppsignalFactoryOrLoader
): Function {
  return function errorHandlerFactory() {
    return new AppsignalErrorHandler(inject(NgZone), appsignalFactory)
  }
}
