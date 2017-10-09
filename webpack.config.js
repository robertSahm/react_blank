var webpack = require("webpack");
var path = require("path");
var htmlWebpackPlugin = require("html-webpack-plugin");
var CleanObsolete = require("webpack-clean-obsolete-chunks");
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

var myHtmlPlugin = new htmlWebpackPlugin({
	template: "./src/template/index.html",
});

var chunkPlugin = new webpack.optimize.CommonsChunkPlugin({
	name: "vendors",
	filename: 'js/vendors.[chunkhash].js',
	minChunks (module) {
		return module.context && module.context.indexOf('node_modules') >= 0;
  },
});

// remove obsolete chunks after a re-compile while watching the files
var removeObsolete = new CleanObsolete({ verbose: false });

var setProd = new webpack.DefinePlugin({
	'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
})

var VENDORS = [
	"react", "react-dom", "react-router-dom", "lodash"
];

var concat = new webpack.optimize.ModuleConcatenationPlugin()

var BundleAnalyzerPlugin = new BundleAnalyzerPlugin()

var uglify = new webpack.optimize.UglifyJsPlugin({
	mangle: true,
  sourceMap: true,   // enable source maps to map errors (stack traces) to modules
  compress: {
    warnings: false, // Suppress uglification warnings
    pure_getters: true,
    unsafe: true,
    unsafe_comps: true,
    screw_ie8: true
  },
  output: {
    comments: false, // remove all comments
  },
  exclude: [/\.min\.js$/gi] // skip pre-minified libs
});

///////////////////////////////////////////////////

module.exports = {
	devtool: "source-map",
	entry: {
		app: "./src/app.js",
		vendors: VENDORS
	},
	output: {
		path: path.join( __dirname, "build" ),
		filename: "js/[name].[chunkhash].js",
		publicPath: ""
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
	// plugins
	plugins: [
		uglify,
		myHtmlPlugin,
		chunkPlugin,
		removeObsolete,
		concat,
		setProd,
		// BundleAnalyzerPlugin,

	], // plugins
	watch: true,
	watchOptions: {
		ignored: /node_modules/
	},
	// set dev server to work with routes reloading
	devServer: {
		historyApiFallback: true
	},
};
