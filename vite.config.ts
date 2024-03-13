import { VitePWA } from "vite-plugin-pwa";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import { createHtmlPlugin } from "vite-plugin-html";
import { visualizer } from "rollup-plugin-visualizer";
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import type { ConfigEnv, UserConfigExport } from "vite";
import path from "path";
import vue from "@vitejs/plugin-vue";
import autoprefixer from 'autoprefixer';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import viteCompression from 'vite-plugin-compression';

export default ({ command }: ConfigEnv): UserConfigExport => {
  return {
    base: "./", // publicPath
    server: {
      host: 'localhost',
      port: 5173,
      proxy: {
        '/api': {
          // target: 'https://yft.design',
          target: 'http://120.77.139.244:8789',
          // target: 'http://127.0.0.1:8789',
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp('^'), ''),
        },
        '/static': {
          // target: 'https://yft.design',
          target: 'http://120.77.139.244:8789',
          // target: 'http://127.0.0.1:8789',
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp('^'), ''),
        },
      },
    },
    plugins: [                                                                                                                                                                                                                            
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
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
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
            title: 'yft-design'
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
      // 关闭文件计算
      reportCompressedSize: false,
      // 关闭生成map文件
      sourcemap: false,
      rollupOptions: {
        output: {
          // chunkFileNames: 'js/[name]-[hash].js',  // 引入文件名的名称
          // entryFileNames: 'js/[name]-[hash].js',  // 包的入口文件名称
          // assetFileNames: '[ext]/[name]-[hash].[ext]', // 资源文件像 字体，图片等
          manualChunks: {
            vue: ['vue'],
            fabric: ['fabric'],
            lodash: ['lodash'],
            'opentype.js': ['opentype.js'],
            'clipper-lib': ['clipper-lib'],
            'element-plus': ['element-plus'],
          },
          // manualChunks(id, any): string {
          //   return id
          // }
        }
      }
    },
  };
};
