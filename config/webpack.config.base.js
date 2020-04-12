const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';
const config = require('../public/config')[isDev ? 'dev' : 'build'];
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const Happypack = require('happypack');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  watchOptions: {
    // 不监听node_modules下的文件
    ignored: /node_modules/
  },
  // mode: isDev ? "development" : 'production',
  // devtool: isDev ? 'cheap-module-eval-source-map' : 'source-map', // 生产环境下使用
  // 单页应用
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'bundle.[hash:6].js',
    publicPath: '/'
  },
  // 抽离公共代码
  optimization: {
    splitChunks: { // 分割代码块
      cacheGroups: {
        vendor: {
          // 第三方依赖
          priority: 1,
          name: 'vendor',
          test: /node_modules/,
          chunks: 'initial',
          minSize: 100,
          minChunks: 1 // 重复引入了几次
        }
      }
    },
    runtimeChunk: {
      name: 'manifest'
    }
  },
  //多页应用
  // entry: {
  //   index: './src/index.js',
  //   login: './src/login.js'
  // },
  // output: {
  //   path: path.resolve(__dirname, 'dist'),
  //   filename: '[name].[hash:6].js'
  // },
  //配置别名
  resolve: {
    // 引入文件可以省略后缀,频率出现最高的文件后缀放在最前面
    extensions: [ '.js', '.jsx', '.ts', '.tsx', '.json',],
    alias: {
      '@components': path.resolve(__dirname, './src/components'),
      '@utils': path.resolve(__dirname, './src/utils')
    },
    // 减少不必要的查找，指明第三方包的绝对路径
    // modules: [path.resolve(__dirname, 'node_modules')],
    // 只采用main字段作为入口文件的描述字段，以减少搜索步骤
    mainFields: ['main']
  },
  // webpack不会打包
  externals: {
    //jquery通过script引入之后，全局中即有了 jQuery 变量,页面仍然可以通过import引用
    'jquery': 'jQuery',
    // key是我们import的包名，value是CDN为我们提供的全局变量名
    // 所以最后webpack会把一个静态资源编译成:,module.export.react = window.React
    // 'react': 'React'
  },
  module: {
    // 不进行转化和解析
    noParse: /jquery|lodash/,
    rules: [
      {
        test: /\.js[x]?$/,
        use: 'Happypack/loader?id=js',
        // use: ['cache-loader', 'babel-loader'], // 在一些性能开销较大的 loader 之前添加 cache-loader，将结果缓存中磁盘中
        // use: {
        //   loader: 'babel-loader?optional=runtime&cacheDirectory',
        //   options: {
        //     presets: ["@babel/preset-env"],
        //     plugins: [
        //       [
        //         "@babel/plugin-transform-runtime",
        //         {
        //           "corejs": 3
        //         }
        //       ]
        //     ]
        //   }
        // },
        // 使用include打包时间快于exclude
        // exclude: /node_modules/
        include: [path.resolve(__dirname, 'src')]
      }, 
      // loader的执行顺序: less-loader -> postcss-loader -> css-loader -> style-loader
      {
        test: /\.(le|c)ss$/,
        use: 'Happypack/loader?id=css',
        // include: [
        //   path.resolve(__dirname, 'src', 'css', 'main'),
        //   path.resolve(__dirname, 'src'),
        //   path.resolve(__dirname, 'node_modules', 'antd', 'dist')
        // ]
        // use: [
        //   {
        //     loader: MiniCssExtractPlugin.loader,
        //     options: {
        //       hmr: isDev,
        //       reloadAll: true
        //     }
        //   }, // 替换之前的style-loader
        //   'css-loader',
        //   {
        //     loader: 'postcss-loader',
        //     options: {
        //       plugins: function() {
        //         return [
        //           require('autoprefixer')({
        //             "overrideBrowserslist": [
        //               ">0.25%",
        //               "not dead"
        //             ]
        //           })
        //         ]
        //       }
        //     }
        //   },
        //   'less-loader'
        // ],
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|jpeg|webp|svg|eot|ttf|woff|woff2)$/,
        use: 'Happypack/loader?id=file',
        // include: [
        //   path.resolve(__dirname, 'src'),
        //   path.resolve(__dirname, 'public')
        // ]
        // use: [
        //   {
        //     loader: 'url-loader',
        //     options: {
        //       limit: 10240, // 资源大小小于10K,将资源转为base64，超过10k，将图片拷贝到dist目录
        //       esModule: false,
        //       name: '[name]_[hash:6].[ext]',
        //       outputPath: 'assets'
        //     }
        //   }
        // ],
        exclude: /node_modules/
      },
      // 使用html-withimg-loader处理图片之后，html就不能使用vm，ejs的模板
      // {
      //   test: /.html$/,
      //   use: 'html-withimg-loader'
      // }
    ]
  },
  plugins: [
    new Happypack({
      id: 'js', //和rule中的id=js对应
      use: ['cache-loader', 'babel-loader'] //将之前 rule 中的 loader 在此配置
    }),
    new Happypack({
      id: 'css',
      use: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader']
    }),
    new Happypack({
      id: 'file',
      use: [
        {
          loader: 'url-loader',
          options: {
            limit: 10240, // 资源大小小于10K,将资源转为base64，超过10k，将图片拷贝到dist目录
            esModule: false,
            name: '[name]_[hash:6].[ext]',
            outputPath: 'assets'
          }
        }
      ]
    }),
    // 单页应用
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      minify: {
        removeAttributeQuotes: false,
        collapseWhitespace: false
      },
      config: config.template
    }),
    // 多页应用
    // new HtmlWebpackPlugin({
    //   template: './public/index.html',
    //   filename: 'index.html',
    //   minify: {
    //     removeAttributeQuotes: false,
    //     collapseWhitespace: false
    //   },
    //   config: config.template,
    //   chunks: ['index'] // 只引入index的js文件
    // }),
    // new HtmlWebpackPlugin({
    //   template: './public/login.html',
    //   filename: 'login.html', //打包后的文件名
    //   chunks: ['login'] // 只引入login的js文件
    // }),
    // 静态资源拷贝
    new CopyWebpackPlugin([
      {
        from: 'public/js/*.js',
        to: path.resolve(__dirname, '../dist', 'js'),
        flatten: true // 只拷贝文件，不拷贝文件路径
      }
    ],
    {
      ignore: ['other.js'] // 不拷贝指定文件
    }),
    // 定义全局变量,减少不必要的import
    new webpack.ProvidePlugin({
      _map: ['lodash', 'map'],
      React: 'react',
      Vue: ['vue/dist/vue.esm.js', 'default']
    }),
    // 抽离css，单独生成css文件夹
    new MiniCssExtractPlugin({
      filename: 'css/[name].css'
    }),
    // 模块提供中间缓存
    // new HardSourceWebpackPlugin(),
    // 忽略本地化
    new webpack.IgnorePlugin(/\.\/locale/, /moment/),
    // 使用动态链接库,manifest.json 用于让 DLLReferencePlugin 映射到相关依赖上
    new webpack.DllReferencePlugin({
      manifest: require(path.resolve(__dirname, '../dist', 'dll', 'manifest.json'))
    })
  ]
};