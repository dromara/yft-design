import { PluginOption } from 'vite'
import { VitePWA } from "vite-plugin-pwa";
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
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        cacheId: "yft-design-cache",
        runtimeCaching: [
          {
            urlPattern: /.*/i,
            handler: "NetworkFirst", // 接口网络优先
            options: {
              cacheName: "interface-cache",
            },
          },
          {
            urlPattern: /(.*?)\.(js|css|ts)/, // js /css /ts静态资源缓存
            handler: "CacheFirst",
            options: {
              cacheName: "js-css-cache",
            },
          },
          {
            urlPattern: /(.*?)\.(png|jpe?g|svg|gif|bmp|psd|tiff|tga|eps)/, // 图片缓存
            handler: "CacheFirst",
            options: {
              cacheName: "image-cache",
            },
          },
        ],
      },
      manifest: {
        name: "yft-design",
        short_name: "yft-design",
        theme_color: "#d14424",
        icons: [
          {
            src: "/img/icons/yft-design-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/img/icons/yft-design-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/img/icons/yft-design-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "/img/icons/yft-design-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        start_url: "./index.html",
        display: "standalone",
        background_color: "#000000",
      },
      devOptions: {
        enabled: false,
      }
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