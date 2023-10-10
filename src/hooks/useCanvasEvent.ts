import type { Fn } from '@vueuse/shared'
import { tryOnScopeDispose } from '@vueuse/shared'
import { CanvasEvents, ObjectEvents } from 'fabric'
import useCanvas from '@/views/Canvas/useCanvas'

type TEventCallback<T = any> = (options: T) => any
type IEvent = CanvasEvents & ObjectEvents

export function useCanvasEvent<K extends keyof IEvent, E extends IEvent[K]>(
  eventName: K,
  handler: TEventCallback<E>,
): Fn

export function useCanvasEvent<K extends keyof IEvent, E extends IEvent[K]>(
  handlers: Record<K, TEventCallback<E>>,
): Fn

export function useCanvasEvent(eventName: any, handler?: any) {
  const [ canvas ] = useCanvas()

  canvas.on(eventName, handler)

  const stop = () => {
    canvas.off(eventName, handler)
  }

  tryOnScopeDispose(stop)

  return stop
}
