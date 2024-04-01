/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { once } from 'lodash-es'

function isIterable<T = any>(thing: any): thing is Iterable<T> {
  return thing && typeof thing === 'object' && typeof thing[Symbol.iterator] === 'function'
}

export class MultiDisposeError extends Error {
  constructor(public readonly errors: any[]) {
    super(`Encountered errors while disposing of store. Errors: [${errors.join(', ')}]`)
  }
}

export interface IDisposable {
  dispose(): void
}

export function isDisposable<E extends object>(thing: E): thing is E & IDisposable {
  return (
    typeof (<IDisposable>thing).dispose === 'function' && (<IDisposable>thing).dispose.length === 0
  )
}

/**
 * Disposes of the value(s) passed in.
 */
export function dispose<T extends IDisposable>(disposable: T): T
export function dispose<T extends IDisposable>(disposable: T | undefined): T | undefined
export function dispose<T extends IDisposable, A extends Iterable<T> = Iterable<T>>(disposables: A,): A
export function dispose<T extends IDisposable>(disposables: Array<T>): Array<T>
export function dispose<T extends IDisposable>(disposables: ReadonlyArray<T>): ReadonlyArray<T>
export function dispose<T extends IDisposable>(arg: T | Iterable<T> | undefined): any {
  if (isIterable(arg)) {
    const errors: any[] = []

    for (const d of arg) {
      if (d) {
        try {
          d.dispose()
        } catch (e) {
          errors.push(e)
        }
      }
    }

    if (errors.length === 1) {
      throw errors[0]
    } else if (errors.length > 1) {
      throw new MultiDisposeError(errors)
    }

    return Array.isArray(arg) ? [] : arg
  } else if (arg) {
    arg.dispose()
    return arg
  }
}

export class DisposableStore implements IDisposable {
  static DISABLE_DISPOSED_WARNING = false

  private readonly _toDispose = new Set<IDisposable>()
  private _isDisposed = false

  /**
   * Dispose of all registered disposables and mark this object as disposed.
   *
   * Any future disposables added to this object will be disposed of on `add`.
   */
  public dispose(): void {
    if (this._isDisposed) {
      return
    }

    this._isDisposed = true
    this.clear()
  }

  /**
   * Returns `true` if this object has been disposed
   */
  public get isDisposed(): boolean {
    return this._isDisposed
  }

  /**
   * Dispose of all registered disposables but do not mark this object as disposed.
   */
  public clear(): void {
    if (this._toDispose.size === 0) {
      return
    }

    try {
      dispose(this._toDispose)
    } finally {
      this._toDispose.clear()
    }
  }

  public add<T extends IDisposable>(o: T): T {
    if (!o) {
      return o
    }
    if ((o as unknown as DisposableStore) === this) {
      throw new Error('Cannot register a disposable on itself!')
    }

    if (this._isDisposed) {
      if (!DisposableStore.DISABLE_DISPOSED_WARNING) {
        console.warn(
          new Error(
            'Trying to add a disposable to a DisposableStore that has already been disposed of. The added object will be leaked!',
          ).stack,
        )
      }
    } else {
      this._toDispose.add(o)
    }

    return o
  }
}

export abstract class Disposable implements IDisposable {
  protected readonly _store = new DisposableStore()

  public dispose(): void {
    this._store.dispose()
  }

  protected _register<T extends IDisposable>(o: T): T {
    if ((o as unknown as Disposable) === this) {
      throw new Error('Cannot register a disposable on itself!')
    }
    return this._store.add(o)
  }
}

/**
 * Turn a function that implements dispose into an {@link IDisposable}.
 */
export function toDisposable(fn: () => void): IDisposable {
  const self = {
    dispose: once(() => {
      fn()
    }),
  }
  return self
}
