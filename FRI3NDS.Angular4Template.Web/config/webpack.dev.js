const path = require('path');

const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const helpers = require('./webpack.helpers');

const ROOT = path.resolve(__dirname, '..');

console.log('------------------------------------------------------- ' + __dirname);

console.log('@@@@@@@@@ USING DEVELOPMENT @@@@@@@@@@@@@@@');

module.exports = {
	devtool: 'source-map',
	performance: {
		hints: false
	},
	entry: {
		'polyfills': './app/polyfills.ts',
		'vendor': './app/vendor.ts',
		'app': './app/main.ts'
	},

	output: {
		path: ROOT + '/wwwroot/',
		filename: 'dist/[name].bundle.js',
		chunkFilename: 'dist/[id].chunk.js',
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
		contentBase: path.join(ROOT, '/wwwroot/'),
		watchOptions: {
			aggregateTimeout: 300,
			poll: 1000
		},
		proxy: {
			"/api/*": {
				target: "http://localhost:1766"
			}
		}
	},

	module: {
		rules: [
			{
				test: /\.ts$/,
				use: [
					'awesome-typescript-loader',
					'angular-router-loader',
					'angular2-template-loader',
					'source-map-loader',
					'tslint-loader'
				]
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
		new webpack.optimize.CommonsChunkPlugin({ name: ['vendor', 'polyfills'] }),

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

