

import useDeselectedEvent from "./useDeselectedEvent"

export const useSelectionUpdated = (evt: any) => {
  const { deselectedEvent } = useDeselectedEvent()
  const deselectedObject = evt.deselected
  deselectedEvent(deselectedObject)
}