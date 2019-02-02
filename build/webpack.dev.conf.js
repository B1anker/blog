const webpack = require("webpack")
const HtmlWebPackPlugin = require("html-webpack-plugin")
const path = require("path")
const baseWebpackConfig = require('./webpack.base.conf')
const merge = require('webpack-merge')
const config = require("../config")
const utils = require("./utils")
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const fs = require('fs')

const resolve = (dir) => {
  return path.join(__dirname, "..", dir)
}
console.log(path.posix.join(config.dev.assetsPublicPath, 'index.html'))
const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
  devtool: config.dev.devtool,
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
      ],
    },
    // inline: true,
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    // overlay: config.dev.errorOverlay
    //   ? { warnings: false, errors: true }
    //   : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    // quiet: true, // necessary for FriendlyErrorsPlugin
    // watchOptions: {
    //   poll: config.dev.poll,
    // },
    disableHostCheck: true,
    // https: true,
    https: {
      key: fs.readFileSync('/Users/b1anker/key/b1anker.com/Nginx/2_b1anker.com.key'),
      cert: fs.readFileSync('/Users/b1anker/key/b1anker.com/Nginx/1_b1anker.com_bundle.crt')
    }
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new ForkTsCheckerWebpackPlugin({
      tsconfig: resolve('tsconfig.json'),
      workers: 2,
      reportFiles: ['src/**/*.{ts,tsx}']
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebPackPlugin({
      template: "index.html",
      filename: "index.html",
      inject: true
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})