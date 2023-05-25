/*
 * @Author: June
 * @Description: 
 * @Date: 2023-05-25 18:41:35
 * @LastEditors: June
 * @LastEditTime: 2023-05-25 20:07:26
 */
import type { ConfigEnv, UserConfigExport } from 'vite';
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default ({ command }: ConfigEnv): UserConfigExport => {
    return {
        base: './', // publicPath
        plugins: [
            vue(),
        ],
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: `@import "src/assets/style/variable.scss";@import "src/assets/style/mixin.scss";`
                },
                less: {
                    modifyVars: {
                        "primary-color": "#d14424",
                        "text-color": "#41464b",
                        "font-size-base": "13px",
                        "border-radius-base": "2px",
                    },
                    javascriptEnabled: true,
                }
            }
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src'),
            },
            extensions: ['.js', '.ts', '.jsx', '.tsx', '.vue', '.json'],
        },
        build: {
            target: 'es2015',
            outDir: path.resolve(__dirname, 'dist'),
            minify: 'terser',
            terserOptions: {
                compress: {
                    //生产环境时移除console
                    drop_console: true,
                    drop_debugger: true,
                },
            }
        }
    }
}
