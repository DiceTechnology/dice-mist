const path = require('path');
const webpack = require('webpack');

const DIR_SOURCE = path.resolve(__dirname, 'src');
const DIR_BUILD = path.resolve(__dirname, 'dist');

module.exports = {
	entry: `${DIR_SOURCE}/index.ts`,
	output: {
		path: DIR_BUILD,
		filename: 'evaporator.js'
	},
	devtool: "source-map",
	resolve: { extensions: [".ts", ".js"] },
	module: {
		rules: [
			{test: /\.worker\.ts$/, loader: 'worker-loader'},
			{test: /\.tsx?$/, loader: "ts-loader" },
		]
	}
};
