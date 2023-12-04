import { App } from 'vue'

import FileInput from '@/components/FileInput.vue'
import ColorPicker from '@/components/ColorPicker/index.vue'
import ColorButton from '@/components/ColorButton.vue'
import TextColorButton from '@/components/TextColorButton.vue'
import FullscreenSpin from '@/components/FullscreenSpin.vue'
import SwipeInput from '@/components/SwipeInput.vue'
import FileUpload from '@/components/FileUpload/index.vue'

const components = {
  FileInput,
  ColorButton,
  TextColorButton,
  ColorPicker,
  FullscreenSpin,
  SwipeInput,
  FileUpload,
}

export default {
  install(app: App) {
    for (const key of Object.keys(components)) {
      app.component(key, components[key as keyof typeof components])
    }
  }
}
