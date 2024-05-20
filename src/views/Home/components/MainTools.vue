<template>
  <div class="page-section-container mb-10" >
    <section>
      <div class="section-header">
        <h2 class="title-wrapper">常用工具</h2>
      </div>
      <div class="tools-wrapper">
        <div v-for="item in HomeTools" :key="item.name">
          <!-- ICON TODO -->
          {{ item.name }}
        </div>
      </div>
    </section>
    <section>
      <div class="section-header">
        <h2 class="title-wrapper">常用物料</h2>
      </div>
      <!-- Image TODO -->
      <div class="materials-wrapper">
        <div class="materials-box">
          <div class="grid-layout-box">
            <div v-for="item in HomeMaterials" :key="item.name">{{ item.name }}</div>
          </div>
        </div>
      </div>
    </section>
  </div>
  <div class="page-section-container">
    <section>
      <div class="section-header">
        <h2 class="title-wrapper">编辑推荐</h2>
      </div>
      <div class="editor-recommend">
        <div>
          <div v-for="item in ['img1','img2','img3','img4']" :key="item">{{ item }}</div>
          <p>每日-新品推介</p>
        </div>
        <div>
          <div>img1</div>
          <div>img2</div>
          <p>
            夏日精选营销物料
          </p>
       </div>
      </div>
    </section>
    <section>
      <div class="section-header">
        <h2 class="title-wrapper">热点日历</h2>
      </div>
      <div class="hot-topic-calendar">
        <div>1</div>
        <div>2</div>
        <div>3</div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { HomeTools, HomeMaterials } from '@/configs/home';
</script>

<style lang="scss" scoped>
.page-section-container {
  display: grid;
  gap: 24px;
  @media (min-width: 1152px) {
    grid-template-columns: repeat(6, minmax(0, 1fr));

    &>section {
      grid-column: span 3 / span 3;
    }
  }

  @media (min-width: 1408px) {
    grid-template-columns: repeat(5, minmax(0, 1fr));

    &>section:nth-child(1) {
      grid-column: span 3 / span 3;
    }

    &>section:nth-child(2) {
      grid-column: span 2 / span 2;
    }
  }

  // common
  .section-header {
    display: flex;
    gap: 24px;
    align-items: center;
    margin-bottom: 16px;

    .title-wrapper {
      font-size: 20px;
      font-weight: bold;
      height: 26px;
      line-height: 26px;
    }
  }

  // 常用工具
  .tools-wrapper {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(152px, 1fr));
    background-color: #f6f7f9;
    border-radius: 12px;
    height: 120px;
    gap: 8px;
    padding: 8px;
    overflow: hidden;

    &>div {
      display: flex;
      align-items: center;
      background-color: #fff;
      border-radius: 6px;
      height: 48px;
      font-size: 14px;
      font-weight: 500;
      text-align: left;
      padding: 8px;
      transition: cubic-bezier(.2, 0, 0, 1) .3s;
      cursor: pointer;
    }

    &>div:hover {
      background-color: #f6f7f9;
      transform: translateY(-2px);
      box-shadow: 0px 0px 1px 0px rgba(0, 0, 0, 0.2), 0px 8px 32px 2px rgba(0, 0, 0, 0.08);
    }
  }

  // 常用物料
  .materials-wrapper {
    display: flex;
    .materials-box {
      flex-grow: 1;
      .grid-layout-box {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(104px, 1fr));
        gap: 8px;
        background-color: #f6f7f9;
        border-radius: 12px;
        padding: 8px;
        overflow: hidden;
        height: 120px;
        &>div {
          padding: 8px;
          background-color: #fff;
          border-radius: 6px;
          height: 104px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: cubic-bezier(.2, 0, 0, 1) .3s;
        }
        &>div:hover {
          transform: translateY(-2px);
          box-shadow: 0px 0px 1px 0px rgba(0, 0, 0, 0.2), 0px 8px 32px 2px rgba(0, 0, 0, 0.08);
        }
      }
    }
  }
  .editor-recommend{
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap:24px;
    height: 227px;
    &>div{
      background-color: #f6f7f9;
      border-radius: 12px;
    }
    &>div:nth-child(1) {
      grid-column: span 2/ span 2;
      @media (min-width: 1152px) {
        grid-column: span 3/ span 3;
      }
      @media (min-width: 1408px) {
        grid-column: span 2/ span 2;
      }
      display: flex;
      justify-content: center;
      gap:4px;
      padding-top: 20px;
      position: relative;
      &>div{
        color:#f6f7f9;
        width:88px;
        height: 156px;
        background-color:orangered;
        opacity: 0.1;
        border-radius: 8px;
        transition: cubic-bezier(.2, 0, 0, 1) .3s;
      }
      &>div:hover{
        background-color: #f6f7f9;
        transform: translateY(-2px);
        box-shadow: 0px 0px 1px 0px rgba(0, 0, 0, 0.2), 0px 8px 32px 2px rgba(0, 0, 0, 0.08);
      }
      &>div:nth-child(2n){
        margin-top:20px;
      }
      &>p{
        width: inherit;
        position:absolute;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 1;
        height: 45px;
        background: #f6f7f9;
        // opacity: .8;
        content: "";
        padding: 12px 16px;
        font-size: 14px;
        font-weight: 500;
      }

    }
 
    &>div:nth-child(2) {
      display: flex;
      grid-column: span 1;
      justify-content: center;
      gap:4px;
      padding-top: 20px;
      position: relative;
      @media (min-width: 1152px) {
        display: none;
      }
      @media (min-width: 1408px) {
        display: flex;
      }
      &>div{
        color:#f6f7f9;
        width:88px;
        height: 156px;
        background-color:orangered;
        opacity: 0.1;
        border-radius: 8px;
        transition: cubic-bezier(.2, 0, 0, 1) .3s;
      }
      &>div:hover{
        background-color: #f6f7f9;
        transform: translateY(-2px);
        box-shadow: 0px 0px 1px 0px rgba(0, 0, 0, 0.2), 0px 8px 32px 2px rgba(0, 0, 0, 0.08);
      }
      &>div:nth-child(2){
        margin-top:20px;
        margin-left: -24px;
      }
      &>p{
        width: inherit;
        position:absolute;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 1;
        height: 45px;
        background: #f6f7f9;
        // opacity: .8;
        content: "";
        padding: 12px 16px;
        font-size: 14px;
        font-weight: 500;
      }
    }
   
  }
  .hot-topic-calendar{
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-template-rows: repeat(2, minmax(0, 1fr));
    height: 185px;
    row-gap: 12px;
    column-gap: 24px;
    height: 227px;
    &>div{
      border-radius: 12px;
    }
    &>div:nth-child(1){
      grid-area:span 2/auto;
      background-color: orangered;
      opacity: 0.1
    }
    &>div{
      background-color: #f6f7f9;
    }
  }
}
</style>