const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const path = require('path');

module.exports = {
	entry: {
		'app': './Assets/Scripts/app/main.ts',
		'polyfills': './Assets/Scripts/polyfills.ts',
		'vendor': './Assets/Scripts/vendor.ts'
	},
	devtool: 'cheap-module-eval-source-map',
	performance: {
		hints: false
	},
	resolve: {
		extensions: ['.ts', '.js', '.json']
	},
	output: {
		path: path.join(__dirname, 'wwwroot'),
		filename: '[name].bundle.js'
	},

	module: {
		rules: [
			{
				test: /\.ts$/,
				options: { configFileName: path.join(__dirname, 'tsconfig.json') },
				use: [
					'awesome-typescript-loader',
					'angular-router-loader',
					'angular2-template-loader',
					'source-map-loader',
					'tslint-loader'
				]
			},
			{
				test: /\.html$/,
				use: 'html-loader'
			},
			{
				test: /(\.css$)/,
				loaders: ['style-loader', 'css-loader']
			},
			{
				test: /\.(png|jpg|gif|ico|woff|woff2|ttf|svg|eot)$/,
				use: 'file-loader?name=assets/[name].[ext]',
			},
			{
				test: /\.scss$/,
				include: path.join(ROOT, 'Assets/Styles'),
				use: [
					'style-loader',
					'css-loader',
					'sass-loader'
				]
			},
			{
				test: /\.scss$/,
				exclude: path.join(ROOT, 'Assets/Styles'),
				use: [
					'raw-loader',
					'sass-loader'
				]
			}
		]
	},
	plugins: [
		new ExtractTextPlugin('Styles/[name].bundle.css'),
		new webpack.optimize.ModuleConcatenationPlugin(),
		new webpack.optimize.CommonsChunkPlugin({
			name: ['app', 'vendor', 'polyfills']
		}),
		new CleanWebpackPlugin(
			[
				'./wwwroot/Images/',
				'./wwwroot/Localization/',
				'./wwwroot/Scripts/app',
				'./wwwroot/Scripts/polyfills.js',
				'./wwwroot/Scripts/vendor.js',
				'./wwwroot/index.html'
			]
		),
		new webpack.ContextReplacementPlugin(
			/angular(\\|\/)core(\\|\/)@angular/,
			path.resolve(__dirname, '../src')
		),
		// inject in index.html
		new HtmlWebpackPlugin({
			template: './Assets/index.html',
			inject: 'body',
			filename: 'index.html'
		}),
		new webpack.ProvidePlugin({
			jQuery: 'jquery',
			$: 'jquery',
			jquery: 'jquery'
		})
	],
	devServer: {
		historyApiFallback: true,
		stats: 'minimal'
	}
};