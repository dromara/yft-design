/*
 * @Author: June
 * @Description:
 * @Date: 2023-05-25 18:41:35
 * @LastEditors: June
 * @LastEditTime: 2023-05-26 08:43:28
 */


import { VitePWA } from "vite-plugin-pwa";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import { createHtmlPlugin } from "vite-plugin-html";
import type { ConfigEnv, UserConfigExport } from "vite";
import path from "path";
import vue from "@vitejs/plugin-vue";
import autoprefixer from 'autoprefixer';
import viteCompression from 'vite-plugin-compression';

export default ({ command }: ConfigEnv): UserConfigExport => {
  return {
    base: "./", // publicPath
    plugins: [
      vue(),
      viteCompression({
        verbose: true,
        disable: false,
        threshold: 10240,
        algorithm: 'gzip',
        ext: '.gz',
      }),
      VitePWA({
        registerType: "autoUpdate",
        workbox: {
          cacheId: "yft-deign-cache",
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
          name: "yft-deign",
          short_name: "yft-deign",
          theme_color: "#d14424",
          icons: [
            {
              src: "./favicon.ico",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "./favicon.ico",
              sizes: "512x512",
              type: "image/png",
            },
            {
              src: "./favicon.ico",
              sizes: "192x192",
              type: "image/png",
              purpose: "maskable",
            },
            {
              src: "./favicon.ico",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable",
            },
          ],
          start_url: "./index.html",
          display: "standalone",
          background_color: "#000000",
        },
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
            title: 'yft-deign'
          }
        }
      })
    ],
    css: {
      postcss: {
        plugins: [
          autoprefixer()
        ]
      },
      preprocessorOptions: {
        scss: {
          additionalData: `@import "src/assets/style/variable.scss";@import "src/assets/style/mixin.scss";`,
        },
        less: {
          modifyVars: {
            "primary-color": "#d14424",
            "text-color": "#41464b",
            "font-size-base": "13px",
            "border-radius-base": "2px",
          },
          javascriptEnabled: true,
        },
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
      extensions: [".js", ".ts", ".jsx", ".tsx", ".vue", ".json"],
    },
    build: {
      target: "es2015",
      outDir: path.resolve(__dirname, "dist"),
      minify: "terser",
      terserOptions: {
        compress: {
          //生产环境时移除console
          drop_console: true,
          drop_debugger: true,
        },
      },
      rollupOptions: {
        output: {
          manualChunks: {
            vue: ['vue'],
            fabric: ['fabric'],
            'element-plus': ['element-plus']
          }
        }
      }
    },
  };
};
