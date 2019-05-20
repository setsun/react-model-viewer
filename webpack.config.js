const webpack = require('webpack');
const path = require('path');
const src = path.resolve(__dirname, 'src');
const dist = path.resolve(__dirname, 'dist');

module.exports = {
  mode: 'production',
  target: 'web',
  context: src,
  entry: 'index.ts',
  output: {
    path: dist,
    filename: 'index.js',
    publicPath: '/',
    libraryTarget: 'umd',
  },
  resolve: {
    modules: [path.resolve('./node_modules'), path.resolve('./src')],
    extensions: ['*', '.js', '.jsx', '.ts', '.tsx', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [{ loader: 'babel-loader' }],
      },
      {
        test: /\.js(x?)$/,
        exclude: /(node_modules)/,
        use: [{ loader: 'babel-loader' }],
      }
    ],
  },
  externals: {
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react',
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(
        process.env.NODE_ENV || 'development'
      ),
    }),
    new webpack.optimize.AggressiveMergingPlugin(),
  ],
};
