'use strict'

const webpack = require('webpack')
const merge = require('webpack-merge')
const common = require('./webpack.common')
const path = require('path')
const WorkboxPlugin = require('workbox-webpack-plugin')

module.exports = merge(common, {
  mode: 'production',
  devtool: 'inline-source-map',

  plugins: [
    new WorkboxPlugin.GenerateSW({
      // these options encourage the ServiceWorkers to get in there fast
      // and not allow any straggling "old" SWs to hang around
      clientsClaim: true,
      skipWaiting: true,
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/.*\.json$/,
          handler: 'CacheFirst'
        }
      ]
    }),


  //   new webpack.NormalModuleReplacementPlugin(
  //     /src\/config\.dev\.ts/,
  //     path.join(process.cwd(), './config/config.prod.ts')
  //   ),
  ],
})
