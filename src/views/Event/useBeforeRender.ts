import useCanvas from "@/views/Canvas/useCanvas"

export const useBeforeRender = () => {
  const [ canvas ] = useCanvas()
  canvas.clearContext(canvas.getSelectionContext())
}