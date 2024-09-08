import { defineStore, storeToRefs } from "pinia"
import { IndexableTypeArray } from 'dexie'
import { useTemplatesStore } from "@/store"
import { classRegistry, FabricObject, SerializedObjectProps } from "fabric"
import { db } from '@/utils/database'
import { Snapshot, SnapshotType } from '@/types/history'
import useCanvas from "@/views/Canvas/useCanvas"

const FabricInstance = async (object: SerializedObjectProps) => {
  return await (classRegistry.getClass(object.type) as typeof FabricObject).fromObject(object) as FabricObject
}

export interface ScreenState {
  snapshotCursor: number
  snapshotLength: number
  processing: boolean
  layering: boolean 
}

export const useSnapshotStore = defineStore('snapshot', {
  state: (): ScreenState => ({
    snapshotCursor: -1, // 历史快照指针
    snapshotLength: 0, // 历史快照长度
    processing: false,
    layering: false
  }),

  getters: {
    canUndo(state) {
      return state.snapshotCursor >= 0
    },
    canRedo(state) {
      return state.snapshotCursor < state.snapshotLength - 1
    },
  },

  actions: {
    setSnapshotCursor(cursor: number) {
      this.snapshotCursor = cursor
    },
    setSnapshotLength(length: number) {
      this.snapshotLength = length
    },
    setProcessing(status: boolean) {
      this.processing = status
    },
    async initSnapshotDatabase() {
      
    },
    async addSnapshot(data: Snapshot) {
      // const templatesStore = useTemplatesStore()
      // const { templateIndex, templates } = storeToRefs(templatesStore)
      // // 获取当前indexeddb中全部快照的ID
      if (!data) return
      const allKeys = await db.snapshots.orderBy('id').keys()
  
      let needDeleteKeys: IndexableTypeArray = []
  
      // // 记录需要删除的快照ID
      // // 若当前快照指针不处在最后一位，那么再添加快照时，应该将当前指针位置后面的快照全部删除，对应的实际情况是：
      // // 用户撤回多次后，再进行操作（添加快照），此时原先被撤销的快照都应该被删除
      // if (this.snapshotCursor >= 0 && this.snapshotCursor < allKeys.length - 1) {
      //   needDeleteKeys = allKeys.slice(this.snapshotCursor + 1)
      // }
      
      await db.snapshots.add(JSON.parse(JSON.stringify(data)))
      // // 计算当前快照长度，用于设置快照指针的位置（此时指针应该处在最后一位，即：快照长度 - 1）
      let snapshotLength = allKeys.length - needDeleteKeys.length + 1
  
      // // 快照数量超过长度限制时，应该将头部多余的快照删除
      const snapshotLengthLimit = 20
      if (snapshotLength > snapshotLengthLimit) {
        needDeleteKeys.push(allKeys[0])
        snapshotLength--
      }
      console.log('snapshotLength:', snapshotLength)
      // 快照数大于1时，需要保证撤回操作后维持页面焦点不变：也就是将倒数第二个快照对应的索引设置为当前页的索引
      
      if (snapshotLength >= 2) {
        // db.snapshots.update(allKeys[snapshotLength - 2] as number, { index: templatesStore.templateIndex })
      }
      await db.snapshots.bulkDelete(needDeleteKeys as number[]) 
      this.setSnapshotCursor(snapshotLength - 1)
      this.setSnapshotLength(snapshotLength)
    },
    async unDo() {
      const [ canvas ] = useCanvas()
      const templatesStore = useTemplatesStore()
      const { templateId } = storeToRefs(templatesStore)
      const snapshotCursor = this.snapshotCursor
      const snapshots: Snapshot[] = await db.snapshots.orderBy('id').toArray()
      const snapshot = snapshots[snapshotCursor]
      if (!snapshot) return
      const { type, index, transform, action, target, objects, tid } = snapshot
      console.log('templateId.value:', templateId.value, 'tid:', tid)
      
      const findIndex = canvas._objects.findIndex(item => item.id === target.id)
      console.log('type:', type, findIndex)
      switch (type) {
        case SnapshotType.ADD:
          canvas.remove(canvas._objects[findIndex]);
          break
        case SnapshotType.DELETE:
          this.addTarget(target, findIndex)
          break
        case SnapshotType.GROUP:
          const group = canvas._objects[index]
          if (!objects) return
          objects.forEach(async (item) => {
            item.left += group.left + group.width / 2
            item.top += group.top + group.height / 2
            const element = await FabricInstance(item)
            canvas.add(element)
          })
          canvas.remove(group)
          break
        case SnapshotType.MODIFY:
          this.layering = true
          const obj = {
            ...target,
            ...transform,
            ...transform?.original,
            originX: target.originX,
            originY: target.originY
          };
            
          const _obj = await FabricInstance(obj);
          canvas.remove(canvas._objects[findIndex]);
          canvas.insertAt(findIndex, _obj);
          this.layering = false
          break
      }

      canvas.requestRenderAll();
      this.setSnapshotCursor(snapshotCursor - 1)
    },
  
    async reDo() {
      const [ canvas ] = useCanvas()
      if (this.snapshotCursor >= this.snapshotLength - 1) return
      const snapshotCursor = this.snapshotCursor + 1
      const snapshots: Snapshot[] = await db.snapshots.orderBy('id').toArray()
      const snapshot = snapshots[snapshotCursor]
      const { type, index, transform, action, target, objects, tid } = snapshot
      const findIndex = canvas._objects.findIndex(item => item.id === target.id)
      switch (type) {
        case SnapshotType.ADD:
          this.addTarget(target, findIndex)
          break
        case SnapshotType.DELETE:
          canvas.remove(canvas._objects[findIndex]);
          break
        case SnapshotType.MODIFY:
          this.layering = true
          const obj = {
            ...target,
            ...transform,
            ...transform?.original,
            originX: target.originX,
            originY: target.originY
          };
            
          const _obj = await FabricInstance(obj);
          canvas.remove(canvas._objects[findIndex]);
          canvas.insertAt(findIndex, _obj);
          this.layering = false
      }
      this.setSnapshotCursor(snapshotCursor)
    },

    async clear () {
      const allKeys = await db.snapshots.orderBy('id').keys()
      await db.snapshots.bulkDelete(allKeys as number[])
      this.setSnapshotCursor(-1)
      this.setSnapshotLength(0)
    },

    async addTarget(target: SerializedObjectProps, findIndex: number) {
      const [ canvas ] = useCanvas()
      const element = await FabricInstance(target);
      canvas.insertAt(findIndex, element);
    }
  }
})