/*
 * @Author: June 1601745371@qq.com
 * @Date: 2024-03-08 10:20:49
 * @LastEditors: June 1601745371@qq.com
 * @LastEditTime: 2024-03-08 14:01:25
 * @FilePath: \github\yft-design\src\plugins\locale\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { createI18n } from 'vue-i18n';
import { LANG } from '@/constants/key'
import { getLocal, setLocal } from '@/utils/local';
import type { App } from 'vue';
import type { I18n, I18nOptions } from 'vue-i18n';

export let i18n: I18n | undefined;

function getLocalLang() {
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

async function createI18nOptions(): Promise<I18nOptions> {
  const locale = getLocalLang();
  const defaultLocal = await import(`./lang/${locale}.ts`);
  const message = defaultLocal.default ?? {};
  return {
    legacy: false,
    locale,
    messages: {
      [locale]: message,
    },
    sync: true, //If you don’t want to inherit locale from global scope, you need to set sync of i18n component option to false.
    silentTranslationWarn: true, // true - warning off
    missingWarn: false,
    silentFallbackWarn: true,
  };
}

function setI18nLanguage(locale: string) {
  if (i18n?.mode === 'legacy') {
    i18n.global.locale = locale;
  } else {
    (i18n?.global.locale as any).value = locale;
  }
  setLocal(LANG, locale);
}

export async function changeLocale(locale: string) {
  const globalI18n = i18n?.global;
  if(!globalI18n) return
  const currentLocale = globalI18n.locale;
  if (currentLocale === locale) return;

  const langModule = ((await import(`./lang/${locale}.ts`)) as any).default as any;
  if (!langModule) return;
  const { message } = langModule;
  globalI18n.setLocaleMessage(locale, message);
  setI18nLanguage(locale);
  return locale;
}

export async function setupI18n(app: App) {
  const options = await createI18nOptions();
  i18n = createI18n(options) as I18n;
  app.use(i18n);
}

  