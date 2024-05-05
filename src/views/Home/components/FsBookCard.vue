<template>
  <div class="fs-book-card-container">
    <div class="fs-book-card-image">
    </div>
    <div class="fs-book-card-footer">
      <div class="title">{{ props.detail.title }}</div>
      <div class="author">
        <div class="author-info">
          <div class="avatar" />
          <span class="name">{{ props.detail.author }}</span>
        </div>
        <div class="like">100</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ICardDetail {
  bgColor: string;
  title: string;
  author: string;
  imageHeight: number;
  [key: string]: any;
}
const props = defineProps<{
  detail: ICardDetail;
}>();
</script>

<style scoped lang="scss">
.fs-book-card {
  &-container {
    width: 100%;
    height: 100%;
    background-color: #fff;
  }
  &-image {
    width: 100%;
    height: v-bind("`${props.detail.imageHeight}px`");
    border: 1px solid #eee;
    border-radius: 20px;
    background-color: v-bind("props.detail.bgColor");
  }
  &-footer {
    padding: 12px;
    font-size: 14px;
    .title {
      margin-bottom: 8px;
      word-break: break-all;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      color: rgba(51, 51, 51, 0.8);
    }
    .author {
      font-size: 13px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 5px;
      .author-info {
        flex: 1;
        display: flex;
        align-items: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        .avatar {
          margin-right: 6px;
          width: 20px;
          height: 20px;
          border-radius: 20px;
          border: 1px solid rgba(0, 0, 0, 0.08);
          background-color: v-bind("props.detail.bgColor");
        }
        .name {
          width: 80%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: rgba(51, 51, 51, 0.8);
        }
      }
    }
  }
}
</style>
