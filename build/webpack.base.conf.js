const webpack = require('webpack')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')
const config = require('../config')
const utils = require('./utils')

const resolve = dir => {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  entry: {
    app: resolve('src/entry.jsx')
  },
  devtool: 'source-map',
  mode: process.env.NODE_ENV,
  output: {
    path: config.build.assetsRoot,
    publicPath:
      process.env.NODE_ENV === 'production'
        ? config.build.assetsPublicPath
        : config.dev.assetsPublicPath,
    filename: '[name].[hash].js'
  },
  resolve: {
    extensions: ['.jsx', '.js', '.less'],
    alias: {
      '@': resolve('src'),
      assets: resolve('src/assets')
    }
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(css|less)$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: true,
              localIdentName: '[name]__[local]-[hash:base64:5]'
            }
          },
          {
            loader: 'less-loader',
            options: {
              javascriptEnabled: true
            }
          }
        ],
        exclude: [resolve('node_modules'), resolve('src/styles/lib')]
      },
      {
        test: /\.(css|less)$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'less-loader',
            options: {
              javascriptEnabled: true
            }
          }
        ],
        include: ['highlightjs', 'codemirror', 'antd']
          .map(path => resolve(`node_modules/${path}`))
          .concat(resolve('src/styles/lib'))
      },
      {
        test: /\.(png|jpe?g|gif|svg|ico)(\?.*)?$/,
        loader: 'url-loader',
        options: process.env.NODE_ENV === 'development' ? {
          limit: 10000,
          name: utils.assetsPath('/[name].[hash:7].[ext]')
        } : {
          limit: 10000,
          name: '[name].[ext]',
          publicPath: 'https://cdn.b1anker.com'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  plugins: [
    new webpack.ContextReplacementPlugin(
      /moment[\/\\]locale/,
      /(zh-cn)\.js/
    ),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../src/service-worker.js'),
        to: config.build.assetsRoot,
        ignore: ['.*']
      },
      {
        from: path.resolve(__dirname, '../src/sw-toolbox.js'),
        to: config.build.assetsRoot,
        ignore: ['.*']
      }
    ])
  ]
}
