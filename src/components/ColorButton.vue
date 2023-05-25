<template>
  <div class="color-btn el-button">
    <div class="color-block">
      <div class="content" :style="{ backgroundColor: color }">
      </div>
    </div>
    <IconPlatte class="color-btn-icon" />
  </div>
</template>

<script lang="ts" setup>
defineProps({
  color: {
    type: String,
    required: true,
  },
})
</script>

<style lang="scss" scoped>
.color-btn {
  display: flex;
  align-items: center;
  padding: 0 !important;
  justify-content: flex-end;
}
.color-block {
  height: 20px;
  margin-left: 8px;
  flex: 1;
  outline: 1px dashed rgba($color: #666, $alpha: .12);
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAEBJREFUOE9jfPbs2X8GIoCkpCQRqhgYGEcNxBlOo2GIM2iGQLL5//8/UTnl+fPnxOWUUQNxhtNoGOLOKYM+2QAAh2Nq10DwkukAAAAASUVORK5CYII=);
}
.content {
  width: 100%;
  height: 100%;
}

.color-btn-icon {
  width: 30px;
  font-size: 20px;
  margin-top: 2px;
  color: #bfbfbf;
  justify-content: center;
}
</style>

