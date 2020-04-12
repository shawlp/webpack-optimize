const {smart} = require('webpack-merge');
const base = require('./webpack.config.base');
const apiMocker = require('mocker-api');
const webpack = require('webpack');
const path = require('path');
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();
const OpenBrowserPlugin = require('open-browser-webpack-plugin');

const config = smart(base, {
  mode: 'development',
  devServer: {
    port: '3000',
    hot: true,
    quiet: false,
    inline: true,
    stats: "errors-only",
    overlay: false,
    clientLogLevel: "silent",
    compress: true, // 是否启用gzip压缩
    contentBase: path.resolve(__dirname, '../dist'),
    // 配置代理
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:4000',
    //     // pathRewrite: {
    //     //   '/api': ''
    //     // }
    //   }
    // }
    // 前端模拟数据
    before(app) {
      apiMocker(app, path.resolve('./mock/mocker.js'))
    }
  },   
  plugins: [
    // 热更新插件
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      DEV: JSON.stringify('development'), //字符串
      FLAG: 'true' //FLAG 是个布尔类型
    }),
    // 打开默认浏览器
    new OpenBrowserPlugin({ url: 'http://localhost:3000' })
  ]
});

module.exports = smp.wrap(config);