const webpack = require('webpack')
const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
const fs = require('fs-extra')

const config = {
	entry: './src/index.js',
	output: {
		path: path.resolve(__dirname, 'docs'),
		filename: 'bundle.js',
	},
	resolve: {
		fallback: {
			fs: false,
			tls: false,
			net: false,
			path: false,
			zlib: false,
			http: false,
			https: false,
			stream: false,
			crypto: false,
			process: false,
		},
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				use: 'babel-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.styl$/,
				use: ['style-loader', 'css-loader', 'stylus-loader'],
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader'],
			},
			{
				test: /\.png$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							mimetype: 'image/png',
						},
					},
				],
			},
		],
	},
	plugins: [
		new NodePolyfillPlugin(),
		new CleanWebpackPlugin(),
		new CopyWebpackPlugin({
			patterns: [
				{
					from: 'assets',
					to: 'assets',
				},
				{
					from: 'CNAME',
				},
			],
		}),
		new HtmlWebpackPlugin({
			title: 'Solana Global Article by Merunas',
			template: './src/index.ejs',
			filename: 'index.html',
		}),
		{
			// Copy files to the outside root folder for github pages purposes
			apply: compiler => {
				compiler.hooks.afterEmit.tap('AfterEmitPlugin', compilation => {
					fs.removeSync(path.join(__dirname.split('/app')[0], 'docs'))
					fs.copySync(path.join(__dirname, 'docs'), path.join(__dirname.split('/app')[0], 'docs'))
				})
			},
		},
	],
}

module.exports = config
