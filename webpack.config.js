const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    // context: __dirname + '\\src\\javascript',
    entry: './src/javascript/index.js',
    module: {
        rules: [
            {
				test: /\.html$/,
				use: {
					loader: 'file-loader',
					query: {
						name: '[name].[ext]'
					}
				}
            },
            {
				test: /\.(sa|sc|c)ss$/,
				use: [
					'style-loader',
					'css-loader',
					'sass-loader'
				]
            },
            {
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: ['@babel/preset-env']
						}
					}
				]
			},
          { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
        ]
      },
      output: {
        path: __dirname + '/dist',
        filename: 'bundle.js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, '/src/index.ejs')
        })
      ]
}