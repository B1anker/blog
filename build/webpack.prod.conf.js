'use strict'
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')

const env = require('../config/prod.env')

const webpackConfig = merge(baseWebpackConfig, {
  devtool: config.build.productionSourceMap ? config.build.devtool : false,
  mode: 'production',
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('[name].[contenthash:8].js'),
    chunkFilename: utils.assetsPath('[name].[contenthash:8].js')
  },
  optimization: {
    splitChunks: {
      chunks: "all",
      minSize: 0,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          chunks: 'initial',
          name: 'vendors',
          priority: 1,
          minChunks: 1
        },
        polyfill: {
          test: /[\\/]node_modules[\\/]core-js/,
          chunks: 'initial',
          name: 'polyfill',
          priority: 2,
          minChunks: 1
        },
        "async-vendors": {
          test: /[\\/]node_modules[\\/]/,
          minChunks: 2,
          priority: 4,
          chunks: "async",
          name: "async"
        }
      }
    },
    runtimeChunk: { name: (entryPoint) => `${entryPoint.name}.runtime` }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': env
    }),
    new CleanWebpackPlugin(),
    new OptimizeCSSPlugin({
      cssProcessorOptions: config.build.productionSourceMap
        ? { safe: true, map: { inline: false } }
        : { safe: true }
    }),
    new HtmlWebpackPlugin({
      filename: config.build.index,
      template: utils.resolve('index.html'),
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      },
      chunksSortMode: 'dependency'
    }),
    new webpack.HashedModuleIdsPlugin(),
    new LodashModuleReplacementPlugin(),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

if (config.build.productionGzip) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
