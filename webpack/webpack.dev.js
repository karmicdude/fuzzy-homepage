'use strict'

const webpack = require('webpack')
const merge = require('webpack-merge')
const common = require('./webpack.common')
const path = require('path')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',

  devServer: {
    contentBase: './dist',
    clientLogLevel: 'info',
    port: 8001,
    allowedHosts: [
      'intranet.stronglocal.com',
    ],
    inline: true,
    historyApiFallback: true,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 500,
    },
    writeToDisk: true,
  },

  plugins: [
  ],
})
