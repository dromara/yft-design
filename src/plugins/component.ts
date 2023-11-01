import { App } from 'vue'

import FileInput from '@/components/FileInput.vue'
// import CheckboxButton from '@/components/CheckboxButton.vue'
// import CheckboxButtonGroup from '@/components/CheckboxButtonGroup.vue'
import ColorPicker from '@/components/ColorPicker/index.vue'
import ColorButton from '@/components/ColorButton.vue'
import TextColorButton from '@/components/TextColorButton.vue'
import FullscreenSpin from '@/components/FullscreenSpin.vue'
import SwipeInput from '@/components/SwipeInput.vue'

const components = {
  FileInput,
  ColorButton,
  TextColorButton,
  // CheckboxButton,
  // CheckboxButtonGroup,
  ColorPicker,
  FullscreenSpin,
  SwipeInput,
}

export default {
  install(app: App) {
    for (const key of Object.keys(components)) {
      app.component(key, components[key as keyof typeof components])
    }
  }
}
