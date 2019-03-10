const webpack = require('webpack')
const tsImportPluginFactory = require('ts-import-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')
const config = require('../config')
const utils = require('./utils')

const resolve = (dir) => {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  entry: {
    app: [
      'react-hot-loader/patch',
      resolve('src/entry.tsx')
    ]
  },
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
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.less'],
    alias: {
      '@': resolve('src'),
      src: resolve('src'),
      assets: resolve('src/assets')
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [{
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            getCustomTransformers: () => ({
              before: [ tsImportPluginFactory({
                libraryDirectory: 'lib',
                libraryName: 'antd',
                style: 'css',
              }) ]
            })
          }
        }]
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
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ],
        include: [
          'highlightjs',
          'codemirror',
          'antd'
        ]
          .map(path => resolve(`node_modules/${path}`))
          .concat(resolve('src/styles/lib'))
      },
      {
        test: /\.less$/,
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
        include: [
          'highlightjs',
          'codemirror',
          'antd'
        ]
          .map((path) => resolve(`node_modules/${path}`))
          .concat(resolve('src/styles/lib'))
      },
      {
        test: /\.(png|jpe?g|gif|svg|ico)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('[name].[hash:7].[ext]'),
          // publicPath: process.env.NODE_ENV === 'production'
          //   ? config.build.assetsPublicPath
          //   : config.dev.assetsPublicPath
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('[name].[hash:7].[ext]'),
          publicPath: process.env.NODE_ENV === 'production'
            ? config.build.assetsPublicPath
            : config.dev.assetsPublicPath
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
        from: resolve('src/service-worker.js'),
        to: process.env.NODE_ENV === 'production' ? config.build.root : './'
      },
      {
        from: resolve('src/favicon.ico'),
        to:  process.env.NODE_ENV === 'production' ? config.build.root : './'
      }
    ])
  ]
}
