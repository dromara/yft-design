import { ref, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useTemplatesStore } from '@/store'

export default () => {
  const { templates } = storeToRefs(useTemplatesStore())

  const timer = ref<number | null>(null)
  const templatesLoadLimit = ref(50)

  const loadTemplate = () => {
    if (templates.value.length > templatesLoadLimit.value) {
      timer.value = window.setTimeout(() => {
        templatesLoadLimit.value = templatesLoadLimit.value + 20
        loadTemplate()
      }, 600)
    }
    else templatesLoadLimit.value = 9999
  }

  onMounted(loadTemplate)

  onUnmounted(() => {
    if (timer.value) clearTimeout(timer.value)
  })

  return {
    templatesLoadLimit,
  }
}