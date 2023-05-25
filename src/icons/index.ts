/*
 * @Author: June
 * @Description: 
 * @Date: 2023-05-25 17:25:23
 * @LastEditors: June
 * @LastEditTime: 2023-05-25 19:11:04
 */

import { App } from 'vue'
import SvgIcon from '@/components/SvgIcon/index.vue'

export default {
  install(app: App) {
    app.component('SvgIcon', SvgIcon)
    // const req = require.context('./svg', false, /\.svg$/)
    // // @ts-ignore
    // const requireAll = requireContext => requireContext.keys().map(requireContext)
    // requireAll(req);
  }
}