const path = require('path');
const webpack = require('webpack');

const DIR_SOURCE = path.resolve(__dirname, 'src');
const DIR_BUILD = path.resolve(__dirname, 'dist');

module.exports = {
	entry: `${DIR_SOURCE}/index.ts`,
	output: {
		libraryTarget: 'commonjs2',

		path: DIR_BUILD,
		filename: 'mist.js'
	},
	devtool: "source-map",
	resolve: { extensions: [".ts", ".js"] },
	module: {
		rules: [
			{test: /\.tsx?$/, loader: "ts-loader" },
		]
	}
};
