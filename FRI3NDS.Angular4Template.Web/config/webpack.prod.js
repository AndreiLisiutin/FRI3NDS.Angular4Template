const path = require('path');

const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ngToolsWebpack = require('@ngtools/webpack');

const helpers = require('./webpack.helpers');

const ROOT = path.resolve(__dirname, '..');

console.log('@@@@@@@@@ USING PRODUCTION @@@@@@@@@@@@@@@');

module.exports = {

	entry: {
		'vendor': './app/vendor.ts',
		'polyfills': './app/polyfills.ts',
		'app': './app/main-aot.ts' // AoT compilation
	},

	output: {
		path: ROOT + '/wwwroot/',
		filename: 'dist/[name].[hash].bundle.js',
		chunkFilename: 'dist/[id].[hash].chunk.js',
		publicPath: '/'
	},

	resolve: {
		modules: [
			'node_modules',
			'app'
		],
		extensions: ['.ts', '.js', '.json']
	},

	devServer: {
		historyApiFallback: true,
		stats: 'minimal',
		outputPath: path.join(ROOT, 'wwwroot/')
	},

	module: {
		rules: [
			{
				test: /\.ts$/,
				use: '@ngtools/webpack'
			},
			{
				test: /\.(png|jpg|gif|woff|woff2|ttf|svg|eot)$/,
				use: 'file-loader?name=assets/[name]-[hash:6].[ext]'
			},
			{
				test: /favicon.ico$/,
				use: 'file-loader?name=/[name].[ext]'
			},
			{
				test: /\.json$/,
				include: path.join(ROOT, 'app/localization'),
				use: 'file-loader?name=localization/[name].[ext]'
			},
			{
				test: /\.css$/,
				use: [
					'style-loader',
					'css-loader'
				]
			},
			{
				test: /\.scss$/,
				include: path.join(ROOT, 'app/styles'),
				use: [
					'style-loader',
					'css-loader',
					'sass-loader'
				]
			},
			{
				test: /\.scss$/,
				exclude: path.join(ROOT, 'app/styles'),
				use: [
					'raw-loader',
					'sass-loader'
				]
			},
			{
				test: /\.html$/,
				use: 'raw-loader'
			}
		],
		exprContextCritical: false
	},

	plugins: [
		// AoT plugin.
		new ngToolsWebpack.AotPlugin({
			tsConfigPath: './tsconfig-aot.json'
		}),
		
		new webpack.NoEmitOnErrorsPlugin(),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false
			},
			output: {
				comments: false
			},
			sourceMap: false
		}),
		new webpack.optimize.CommonsChunkPlugin(
			{
				name: ['vendor', 'polyfills']
			}),

		new HtmlWebpackPlugin({
			filename: 'index.html',
			inject: 'body',
			template: 'app/index.html'
		}),

		new CopyWebpackPlugin([
			{ from: './app/images/*.*', to: 'assets/', flatten: true }
		])
	]
};

