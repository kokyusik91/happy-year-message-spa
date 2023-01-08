const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  // 최초의 진입점 key값에 파일 이름 설정 할 수 있음!
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
