
module.exports = ({
  transpileDependencies: true,
  lintOnSave: false,
  devServer:{
    historyApiFallback: true,
    allowedHosts: "all",
    proxy:{
      "/api":{
        assetsSubDirectory: 'static',
        target:"http://localhost:9527",
        changeOrigin:true,
        pathRewrite:{
          "/api":"/api"
        }
      }
    }
  }, 
  // chainWebpack: config => {
  //   config.module
  //     .rule("css")
  //     .test(/\.css$/)
  //     .oneOf("vue")
  //     .resourceQuery(/\?vue/)
  //     .use("px2rem")
  //     .loader("px2rem-loader")
  //     .options({
  //       remUnit: 192
  //     });
  // },
})
// const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
//
// configureWebpack: {
// 	plugins: [new NodePolyfillPlugin()]
// }


