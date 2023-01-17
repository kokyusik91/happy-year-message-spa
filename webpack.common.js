const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

// ES6가 아닌 node의 module 문법
module.exports = {
  mode: 'none',
  // 최초의 진입점 key값에 파일 이름 설정 할 수 있음!
  entry: {
    main: './src/index.ts',
  },
  output: {
    filename: './js/[name].js',
    path: path.resolve(__dirname, './build'),
    clean: true,
    assetModuleFilename: 'assets/[hash][ext][query]',
    publicPath: '/',
  },
  devServer: {
    port: 9000,
    hot: true,
    compress: true,

    // historyApiFallBack: 히스토리 API를 사용하는 SPA 개발시 설정한다. 404가 발생하면 index.html로 리다이렉트한다.
    historyApiFallback: true,
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
      {
        test: /\.(jpg|jpeg|gif|png|svg|ico)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: '/assets/images',
              name: '[name].[ext]?[hash]',
            },
          },
        ],
        exclude: /fonts/,
      },
      {
        test: /\.(ttf|eot|svg|woff(2)?)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        type: 'asset/resource',
        dependency: { not: ['url'] },
        generator: {
          filename: 'fonts/[name][ext][query]',
        },
        exclude: /images/,
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
