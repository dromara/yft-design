import type { SerializedObjectProps, Transform, FabricObject } from "fabric"

export interface Snapshot {
  index: number
  target: SerializedObjectProps
  type: SnapshotType
  tid?: string
  objects?: SerializedObjectProps[]
  id?: number
  action?: string
  transform?: Transform
  move?: number
}

export enum SnapshotType {
  ADD = 1,
  DELETE = 2,
  MODIFY = 3,
  ORDER = 4,
  GROUP = 5,
  UNGROUP = 6,
  LOCK = 7,
  UNLOCK = 8,
}