export interface ContextMenu {
  text?: string
  subText?: string
  divider?: boolean
  disable?: boolean
  hide?: boolean
  children?: ContextMenu[]
  handler?: (el: HTMLElement) => void
}

export interface Axis {
  x: number
  y: number
}