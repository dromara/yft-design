import { App } from 'vue'

import FileInput from '@/components/FileInput.vue'
import ColorPicker from '@/components/ColorPicker/index.vue'
import ColorButton from '@/components/ColorButton.vue'
import TextColorButton from '@/components/TextColorButton.vue'
import FullscreenSpin from '@/components/FullscreenSpin.vue'
import LinePointMarker from '@/components/LinePointMarker.vue'
import SwipeInput from '@/components/SwipeInput.vue'
import FileUpload from '@/components/FileUpload/index.vue'
import FileExport from '@/components/FileExport/index.vue'
import ImageMatting from '@/components/ImageMatting/index.vue'
import ImageFillColor from '@/components/ImageFillColor.vue'
import HomePopover from '@/components/HomePopover.vue'
import LoginDialog from '@/components/LoginDialog/index.vue'

const components = {
  FileInput,
  ColorButton,
  TextColorButton,
  ColorPicker,
  FullscreenSpin,
  LinePointMarker,
  SwipeInput,
  FileUpload,
  FileExport,
  ImageMatting,
  ImageFillColor,
  HomePopover,
  LoginDialog
}

export default {
  install(app: App) {
    for (const key of Object.keys(components)) {
      app.component(key, components[key as keyof typeof components])
    }
  }
}
