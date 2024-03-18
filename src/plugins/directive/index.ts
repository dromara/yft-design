import { App } from 'vue'
import Contextmenu from './contextmenu'
import ClickOutside from './clickOutside'
import DropImage from './dropImage'
// import { ClickOutside } from 'element-plus'

export default {
  install(app: App) {
    app.directive('contextmenu', Contextmenu)
    app.directive('click-outside', ClickOutside)
    app.directive('drop-image', DropImage)
  }
}
