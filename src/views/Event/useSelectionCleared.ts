import useDeselectedEvent from "./useDeselectedEvent"

export const useSelectionCleared = async (evt: any) => {
  const { deselectedEvent } = useDeselectedEvent()
  const deselectedObject = evt.deselected
  deselectedEvent(deselectedObject)
}