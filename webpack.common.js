var webpack = require('webpack');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

var chunkPlugin = new webpack.optimize.CommonsChunkPlugin({
  names: ["vendors", "manifest"],
  filename: 'js/vendors.[chunkhash].js',
  minChunks (module) {
    return module.context && module.context.indexOf('node_modules') >= 0;
  },
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
      title: 'Production',
      template: "./src/template/index.html",
    })
  ],

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: "js/[name].[chunkhash].js",
    publicPath: ""
  }
};
