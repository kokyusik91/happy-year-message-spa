const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: {
    kks: '/src/index.ts',
  },
  output: {
    filename: './js/[name].js',
    path: path.resolve(__dirname, './build'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [new HtmlWebpackPlugin()],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
}
