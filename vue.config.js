const { defineConfig } = require('@vue/cli-service')
const CompressionPlugin = require('compression-webpack-plugin')
const zlib = require('zlib')
const path = require('path')
function resolve(dir) {
  return path.join(__dirname, dir)
}
// const { StyleLintPlugin } = require("stylelint-webpack-plugin")
module.exports = defineConfig({
  productionSourceMap: false,
  publicPath: "./",
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
          @import "@/assets/style/variable.scss";
          @import "@/assets/style/mixin.scss";
        `,
      },
      less: {
        lessOptions: {
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
  },
  configureWebpack: {
    resolve: {
      extensions: ['.js', '.vue', '.json']
    },
    // plugins: [
    //   // new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    //   // 下面两项配置才是 compression-webpack-plugin 压缩配置
    //   // 压缩成 .gz 文件
    //   new CompressionPlugin({
    //     filename: '[path][base].gz',
    //     algorithm: 'gzip',
    //     test: /\.js$|\.css$|\.html$/,
    //     threshold: 10240,
    //     minRatio: 0.8
    //   }),
    //   // 压缩成 .br 文件，如果 zlib 报错无法解决，可以注释这段使用代码，一般本地没问题，需要注意线上服务器会可能发生找不到 zlib 的情况。
    //   new CompressionPlugin({
    //     filename: '[path][base].br',
    //     algorithm: 'brotliCompress',
    //     test: /\.(js|css|html|svg)$/,
    //     compressionOptions: {
    //       params: {
    //         [zlib.constants.BROTLI_PARAM_QUALITY]: 11
    //       }
    //     },
    //     threshold: 10240,
    //     minRatio: 0.8
    //   })
    // ],
  },
  chainWebpack(config) {
    // config.plugin('webpack-bundle-analyzer').use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
    if (process.env.NODE_ENV !== 'development') {
      config.optimization.minimizer('terser').tap(options => {
        options[0].terserOptions.compress.drop_console = true
        return options
      })
      config.optimization.splitChunks.chunks = 'all';        
      config.optimization.splitChunks.minSize = 1000000;      
      config.optimization.splitChunks.maxSize = 2000000; 
      config.plugin('compressionPlugin').use(
        new CompressionPlugin({
          filename: '[path][base].gz',
          algorithm: 'gzip',
          test: /\.js$|\.css$|\.html$/,
          threshold: 10240,
          minRatio: 0.8
        })
      )
    }
  },
  pwa: {
    name: "vue-fabric-draw",
    themeColor: "#d14424",
    iconPaths: {
      faviconSVG: null,
      favicon32: "/favicon.ico",
      favicon16: "/favicon.ico",
      appleTouchIcon: "/favicon.ico",
      maskIcon: null,
      msTileImage: null,
    },
    manifestOptions: {
      name: "vue-fabric-draw",
      short_name: "vue-fabric-draw",
      theme_color: "#d14424",
      icons: [
        {
          src: "/favicon.ico",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "/favicon.ico",
          sizes: "512x512",
          type: "image/png",
        },
        {
          src: "/favicon.ico",
          sizes: "192x192",
          type: "image/png",
          purpose: "maskable",
        },
        {
          src: "/favicon.ico",
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable",
        },
      ],
      start_url: ".",
      display: "standalone",
      background_color: "#000000",
    },
    // workboxOptions: {
    //   runtimeCaching: [
    //     {
    //       urlPattern: /.*/,
    //       handler: "networkFirst",
    //       options: {
    //         cacheName: "vue-fabric-draw",
    //         expiration: {
    //           maxAgeSeconds: 60 * 60 * 10,
    //         },
    //         cacheableResponse: {
    //           statuses: [0, 200],
    //         },
    //       },
    //     },
    //   ],
    //   include: [/\.ttf$/],
    //   skipWaiting: true,
    // },
  },
  transpileDependencies: true,
});
