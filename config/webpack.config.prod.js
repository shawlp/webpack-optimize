const {smart} = require('webpack-merge');
const base = require('./webpack.config.base');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const OptimizeCssplugin = require('optimize-css-assets-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const webpack = require('webpack');
// 测量各个插件和loader所花费的时间
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();

const config = smart(base, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    // 清空文件
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['**/*', '!dll', '!dll/**'] // 不删除dll目录下的文件
    }),
    // 将抽离出来的css文件进行压缩
    new OptimizeCssplugin(),
    new webpack.DefinePlugin({
      DEV: JSON.stringify('production') //字符串
    }),
    // 打包体积可视化
    new BundleAnalyzerPlugin()
  ]
});

module.exports = smp.wrap(config);