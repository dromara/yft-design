import { debounce, throttle } from 'lodash-es'
import { useSnapshotStore } from '@/store'
import { Snapshot } from '@/types/history'

export default () => {
  const snapshotStore = useSnapshotStore()

  // 添加历史快照(历史记录)
  const addHistorySnapshot = debounce(function(data: Snapshot) {
    snapshotStore.addSnapshot(data)
  }, 10, { trailing: true })

  // 重做
  const redo = throttle(function() {
    snapshotStore.reDo()
  }, 100, { leading: true, trailing: false })

  // 撤销
  const undo = throttle(function() {
    snapshotStore.unDo()
  }, 100, { leading: true, trailing: false })

  // 清空
  const clearHistorySnapshot = throttle(function() {
    snapshotStore.clear()
  }, 100, { leading: true, trailing: false })

  return {
    addHistorySnapshot,
    redo,
    undo,
    clearHistorySnapshot,
  }
}