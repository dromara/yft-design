// jry 20240416
// pinia存在此问题https://github.com/vuejs/pinia/discussions/2487
import { watch, onMounted } from 'vue'
import { useSlidesStore } from '@/store'
const slidesStore = useSlidesStore()
const { title, theme, slides } = slidesStore
// import type { Slide, SlideTheme} from './types/slides'
onMounted(async () => {
  // 初始化幻灯片数据
  window.addEventListener("message", e => {
    //监听message 收到数据e.data;
    if (e.data.event == 'poster-data') {
      let sceneData = JSON.parse(e.data.data);
      console.log('父页面传递来的数据', sceneData);
      if (sceneData) {
        slidesStore.setTitle(sceneData.title)
        slidesStore.setTheme(sceneData.theme)
        slidesStore.setSlides(sceneData.slides)
      } else {
        slidesStore.setTitle('未命名')
        slidesStore.setSlides([])
      }
    }
  })
  window.parent.postMessage({
    event: 'poster-ready',
    data: {}
  }, "*")
})
watch(slides, (newValue: any)=>{ // 监测一个响应式值的变化
    let data = {
      title: title,
      theme: theme,
      slides: newValue
    }
    // console.log(sd)
    if (window && window.parent) {
      window.parent.postMessage({
        event: 'poster-data-update',
        data: data
      }, "*");
    }
})
