const webpack = require('webpack');
const path = require('path');
const config = require('sapper/config/webpack.js');
const sveltePreprocess = require('svelte-preprocess');
const pkg = require('./package.json');

const mode = process.env.NODE_ENV;
const dev = mode === 'development';
const hot = dev && process.env.HOT != 0

const alias = { svelte: path.resolve('node_modules', 'svelte') };
const extensions = ['.mjs', '.js', '.json', '.svelte', '.html'];
const mainFields = ['svelte', 'module', 'browser', 'main'];

const preprocess = sveltePreprocess({ postcss: true });

// const clientOutput = {
// 	filename: '[name].js',
// 	chunkFilename: '[name].[id].js',
// 	publicPath: `client/`
// };

module.exports = {
	client: {
		entry: config.client.entry(),
		output: config.client.output(),
		// output: clientOutput,
		resolve: { alias, extensions, mainFields },
		module: {
			rules: [
				{
					test: /\.(svelte|html)$/,
					use: {
						loader: 'svelte-loader-hot',
						options: {
							preprocess,
							dev,
							hydratable: true,
							hotReload: hot, // pending https://github.com/sveltejs/svelte/issues/2377
							hotOptions: {
								// optimistic will try to recover from runtime errors during
								// component init (instead of doing a full reload)
								optimistic: true
							}
						}
					}
				}
			]
		},
		mode,
		plugins: [
			// pending https://github.com/sveltejs/svelte/issues/2377
			hot && new webpack.HotModuleReplacementPlugin(),
			new webpack.DefinePlugin({
				'process.browser': true,
				'process.env.NODE_ENV': JSON.stringify(mode)
			}),
		].filter(Boolean),
		devtool: dev && 'inline-source-map'
	},

	server: {
		entry: config.server.entry(),
		output: config.server.output(),
		target: 'node',
		resolve: { alias, extensions, mainFields },
		externals: Object.keys(pkg.dependencies).concat('encoding'),
		module: {
			rules: [
				{
					test: /\.(svelte|html)$/,
					use: {
						loader: 'svelte-loader',
						options: {
							preprocess,
							css: false,
							generate: 'ssr',
							dev
						}
					}
				}
			]
		},
		mode: process.env.NODE_ENV,
		performance: {
			hints: false // it doesn't matter if server.js is large
		}
	},

	serviceworker: {
		entry: config.serviceworker.entry(),
		output: config.serviceworker.output(),
		mode: process.env.NODE_ENV
	}
};
