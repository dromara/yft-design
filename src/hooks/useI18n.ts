/*
 * @Author: June 1601745371@qq.com
 * @Date: 2024-03-08 11:17:26
 * @LastEditors: June 1601745371@qq.com
 * @LastEditTime: 2024-03-11 12:00:57
 * @FilePath: \github\yft-design\src\hooks\useI18n.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useI18n as i18n } from 'vue-i18n';
import { changeLocale } from '@/plugins/i18n'

const useI18n = () => {
  return {
    changeLocale,
    ...(i18n() || {} )
  }
}

export default useI18n