'use strict'
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: {
    app: 'index.ts',
  },

  resolve: {
    modules: [path.resolve(process.cwd(), 'src'), 'node_modules'],
    extensions: ['.ts', '.js', 'scss', 'sass'],
  },

  context: path.join(process.cwd(), 'src'),

  output: {
    filename: 'scripts/[name].[hash].js',
    chunkFilename: 'scripts/[name].[hash].js',
    path: path.join(process.cwd(), 'dist'),
  },

  plugins: [
    new CleanWebpackPlugin(),

    new HtmlWebpackPlugin({
      template: 'index.html',
      chunksSortMode: 'dependency',
      favicon: 'images/favicon.png',
    }),

    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'async'
    }),

    new CopyPlugin([
      { from: 'images/background.jpg', to: 'images/background.jpg' },
    ]),
  ],

  module: {
    rules: [
      {
        test: /\.css|\.s(c|a)ss$/,
        use: [
          { loader: path.resolve('./webpack/lit-element-scss-loader.js') },
          'extract-loader',
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.ts$/,
        loader: 'ts-loader',
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [ 'file-loader' ]
      },
    ],
  },
}
