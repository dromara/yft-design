import { PluginOption } from 'vite'
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import { createHtmlPlugin } from "vite-plugin-html";
import { visualizer } from "rollup-plugin-visualizer";
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import viteCompression from 'vite-plugin-compression';
import vue from "@vitejs/plugin-vue";
import path from "path";

export const createVitePlugins = (
  mode: string,
): (PluginOption | PluginOption[])[] => {
  return [
    vue(),
    visualizer({ open: true }),
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: 'gzip',
      ext: '.gz',
    }),
    AutoImport({
      imports: ['vue'],
      dts: path.resolve(__dirname, "../src/types/auto-imports.d.ts"),
      eslintrc: {
        enabled: true
      },
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      dts: path.resolve(__dirname, "../src/types/components.d.ts"),
    }),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), "src/icons/svg")], // icon存放的目录
      symbolId: "icon-[name]", // symbol的id
      inject: "body-last", // 插入的位置
      customDomId: "__svg__icons__dom__", // svg的id
    }),
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          title: 'yft-design'
        }
      }
    })
  ]
}