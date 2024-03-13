/*
 * @Author: June 1601745371@qq.com
 * @Date: 2024-03-08 10:20:49
 * @LastEditors: June 1601745371@qq.com
 * @LastEditTime: 2024-03-11 11:59:37
 * @FilePath: \github\yft-design\src\plugins\locale\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { createI18n } from 'vue-i18n';
import { LANG } from '@/configs/key'
import { getLocal, setLocal } from '@/utils/local';
import type { App } from 'vue';
import type { I18n, I18nOptions } from 'vue-i18n';

export let i18n: I18n | undefined;

const getLocalLang = () => {
  let localLang = getLocal(LANG);
  if (!localLang) {
    let defaultLang = navigator.language;
    if (defaultLang) {
      const _lang = defaultLang.split('-')[0]
      defaultLang = _lang;
      localLang = _lang;
      setLocal(LANG, _lang)
    }
  }
  return localLang;
}

const  createI18nOptions = async (): Promise<I18nOptions> =>   {
  const locale = getLocalLang();
  const modules: Record<string, any> = import.meta.glob('./lang/*', { eager: true })
  const messages: Record<string, any> = {}
  Object.keys(modules).forEach((i: any) => {
    const key = i.replace('./lang/', '').split('.')[0]
    messages[key] = modules[i].default
  })
  return {
    legacy: false,
    locale,
    messages,
    allowComposition: true,
    globalInjection: true,
    silentTranslationWarn: true, // true - warning off
    missingWarn: false,
    silentFallbackWarn: false,
  };
}

const setI18nLanguage = (locale: string) => {
  if (i18n?.mode === 'legacy') {
    i18n.global.locale = locale;
  } else {
    (i18n?.global.locale as any).value = locale;
  }
  setLocal(LANG, locale);
}

export const changeLocale = async (locale: string) => {
  const globalI18n = i18n?.global;
  if(!globalI18n) return
  const currentLocale = globalI18n.locale;
  if (currentLocale === locale) return;
  setI18nLanguage(locale);
  return locale;
}

export const setupI18n = async (app: App) => {
  const options = await createI18nOptions();
  console.log(options)
  i18n = createI18n(options) as I18n;
  app.use(i18n);
}

  