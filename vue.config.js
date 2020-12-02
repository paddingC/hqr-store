// vue.config.js
const path = require('path')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const CopyWebpackPlugin = require('copy-webpack-plugin')
function resolve(dir) {
    return path.join(__dirname, dir)
}

module.exports = {
    // 使用运行时编译器的 Vue 构建版本
    runtimeCompiler: true,
    // 开启生产环境SourceMap，设为false打包时不生成.map文件
    productionSourceMap: true,
    // 关闭ESLint，如果你需要使用ESLint，把lintOnSave设为true即可
    lintOnSave: false,
    devServer: {
        disableHostCheck: true,
        open: true,        // 是否自动打开浏览器页面
        host: 'localhost',    // 指定使用一个 host，默认是 localhost
        port: 8011,         // 端口地址
        https: true,       // 使用https提供服务
        // 这里写你调用接口的基础路径，来解决跨域，如果设置了代理，那你本地开发环境的axios的baseUrl要写为 '' ，即空字符串
        // proxy: 'https://web-qa.medlinker.com/'
        // host: '0.0.0.0',
        // port: 80,
        // https: true,
        proxy: {
            '/jsTest': {
                target: 'http://localhost:8081',
                pathRewrite: { '^/jsTest': '' },
                changeOrigin: true
            }
        }
    },
    // devServer: {
    //     disableHostCheck: true,
    //     open: true,        // 是否自动打开浏览器页面
    //     host: 'localhost',    // 指定使用一个 host，默认是 localhost
    //     port: 8011,         // 端口地址
    //     https: true,       // 使用https提供服务
    //     // 这里写你调用接口的基础路径，来解决跨域，如果设置了代理，那你本地开发环境的axios的baseUrl要写为 '' ，即空字符串
    //     // proxy: 'https://web-qa.medlinker.com/'
    //     host: '0.0.0.0',
    //     port: 443,
    // },
    chainWebpack: (config) => {
        config.resolve.alias
            .set('@', resolve('src'))
            .set('assets', resolve('src/assets'))
            .set('components', resolve('src/components'))
    },
    configureWebpack: config => {
        // 生产环境打包分析体积
        if (process.env.NODE_ENV === 'production') {
            return {
                plugins: [
                    new BundleAnalyzerPlugin()
                ]
            }
        }
        config.plugins.push(
            new CopyWebpackPlugin([
                {
                    from: './static', // 新增可以被index.html访问的静态文件目录,支持多个
                    to: this.outputDir,
                    ignore: ['.*']
                }
            ])
        )
    },
    css: {
        loaderOptions: {
            sass: {
                data: `
                @import "@/style/mixin.scss";
                @import "@/style/_var.scss";
                `
            }
        }
    },

}
