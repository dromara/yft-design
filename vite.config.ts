import type { ConfigEnv, UserConfigExport } from "vite";
import path from "path";
import autoprefixer from 'autoprefixer';
import AutoImport from 'unplugin-auto-import/vite';
import tailwindcss from  'tailwindcss';
import { include, exclude } from './build/optimize';
import { createVitePlugins } from './build/plugins';

export default ({ command, mode }: ConfigEnv): UserConfigExport => {
  return {
    base: "./", // publicPath
    server: {
      host: 'localhost',
      port: 5173,
      proxy: {
        '/api': {
          // target: 'https://yft.design',
          target: 'http://127.0.0.1:8789',
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp('^'), ''),
        },
        '/static': {
          // target: 'https://yft.design',
          target: 'http://127.0.0.1:8789',
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp('^'), ''),
        },
        '/yft-static': {
          // target: 'https://yft.design',
          target: 'http://127.0.0.1:8789',
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp('^'), ''),
        },
      },
    },
    plugins: createVitePlugins(mode),
    optimizeDeps: { include, exclude },
    css: {
      postcss: {
        plugins: [
          tailwindcss,
          autoprefixer({
            // 自动添加前缀
            overrideBrowserslist: [
                'Android 4.1',
                'iOS 7.1',
                'Chrome > 31',
                'ff > 31',
                'ie >= 8',
                '> 1%',
                'last 2 versions',
                'not dead',
                'not ie 11',
                //'last 2 versions', // 所有主流浏览器最近2个版本
            ],
            grid: true,
          }),
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
            'lodash-es': ['lodash-es'],
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
