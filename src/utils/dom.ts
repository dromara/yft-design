import { IDisposable } from '@/utils/lifecycle'

class DomListener implements IDisposable {
  private _handler: (e: any) => void
  private _node: EventTarget
  private readonly _type: string
  private readonly _options: boolean | AddEventListenerOptions

  constructor(
    node: EventTarget,
    type: string,
    handler: (e: any) => void,
    options?: boolean | AddEventListenerOptions,
  ) {
    this._node = node
    this._type = type
    this._handler = handler
    this._options = options || false
    this._node.addEventListener(this._type, this._handler, this._options)
  }

  public dispose(): void {
    if (!this._handler) {
      // Already disposed
      return
    }

    this._node.removeEventListener(this._type, this._handler, this._options)

    // Prevent leakers from holding on to the dom or handler func
    this._node = null!
    this._handler = null!
  }
}

export function addDisposableListener<K extends keyof GlobalEventHandlersEventMap>(
  node: EventTarget,
  type: K,
  handler: (event: GlobalEventHandlersEventMap[K]) => void,
  useCapture?: boolean,
): IDisposable
export function addDisposableListener(
  node: EventTarget,
  type: string,
  handler: (event: any) => void,
  useCapture?: boolean,
): IDisposable
export function addDisposableListener(
  node: EventTarget,
  type: string,
  handler: (event: any) => void,
  options: AddEventListenerOptions,
): IDisposable
export function addDisposableListener(
  node: EventTarget,
  type: string,
  handler: (event: any) => void,
  useCaptureOrOptions?: boolean | AddEventListenerOptions,
): IDisposable {
  return new DomListener(node, type, handler, useCaptureOrOptions)
}
