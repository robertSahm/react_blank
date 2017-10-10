const webpack = require('webpack');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

var chunkPlugin = new webpack.optimize.CommonsChunkPlugin({
  name: "manifest",
  minChunks: Infinity
});

module.exports = {
  entry: {
    app: "./src/app.js",
  },

  module: {
    rules: [
      {
        use: "babel-loader",
        test: /\.js$/,
        exclude: /node_modules/
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        loader: 'file-loader',
        options: {
          outputPath: 'img/'
        }
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { importLoaders: 1 } },
          'postcss-loader'
        ]
      }
    ] // rules
  }, // module

  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      favicon: './src/img/favicon/favicon.ico',
      title: 'Production',
      template: "./src/template/index.html",
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common' // Specify the common bundle's name.
    })
  ],

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: "js/[name].[chunkhash].js",
    publicPath: ""
  }
};
