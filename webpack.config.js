const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

// ES6가 아닌 node의 module 문법
module.exports = {
  mode: 'none',
  // 최초의 진입점 key값에 파일 이름 설정 할 수 있음!
  entry: {
    kks: '/src/index.ts',
  },
  output: {
    filename: './js/[name].js',
    path: path.resolve(__dirname, './build'),
    clean: true,
  },
  devServer: {
    port: 9000,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
    }),
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
}
