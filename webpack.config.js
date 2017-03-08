var webpack = require('webpack');

module.exports = {
	entry: {
		'app': __dirname + '/dev/app.js',
		'admin': __dirname + '/dev/admin.js'
	},
	output: {
		pathinfo: true,
		path: __dirname + '/rainloop/v/0.0.0/static/js/',
		filename: '[name].js',
		publicPath: 'rainloop/v/0.0.0/static/js/',
		chunkFilename: '[chunkhash].subapp.js'
	},
	plugins: [
//		new webpack.optimize.CommonsChunkPlugin('common.js'),
		new webpack.optimize.OccurrenceOrderPlugin()
	],
	resolve: {
		modules: [__dirname + '/dev/'],
		extensions: ['.js'],
		alias: {
			"ko": __dirname  + "/dev/External/ko.js"
		}
	},
	externals: {
		'window': 'window',
		'JSON': 'window.JSON',
		'JSEncrypt': 'window.JSEncrypt',
		'$LAB': 'window.$LAB',
		'SimplePace': 'window.SimplePace',
		'PhotoSwipe': 'window.PhotoSwipe',
		'PhotoSwipeUI_Default': 'window.PhotoSwipeUI_Default',
		'queue': 'window.queue',
		'moment': 'window.moment',
		'ifvisible': 'window.ifvisible',
		'crossroads': 'window.crossroads',
		'hasher': 'window.hasher',
		'Jua': 'window.Jua',
		'Autolinker': 'window.Autolinker',
		'Tinycon': 'window.Tinycon',
		'buzz': 'window.buzz',
		'ssm': 'window.ssm',
		'key': 'window.key',
		'_': 'window._',
		'$': 'window.jQuery'
	}
};