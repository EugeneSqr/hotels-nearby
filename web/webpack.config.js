const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackRootPlugin = require('html-webpack-root-plugin');

module.exports = (env, argv) => {
  const mode = argv.mode;
  return {
    devtool: mode === 'development' ? 'source-map' : undefined,
    entry: './src/index.js',
    plugins: [
      new HtmlWebpackPlugin({title: 'Hotels nearby'}),
      new HtmlWebpackRootPlugin()
    ],
    devServer: {
      contentBase: './dist'
    },
    output: {
      filename: '[name].[contenthash].js',
      path: path.resolve(__dirname, 'dist')
    },
    module: {
      rules: [{
        test: /\.(js|jsx)$/,
        exclude: [/node_modules/],
        use: [
          'babel-loader',
          {
            loader: 'eslint-loader',
            options: {
              emitWarning: true,
            },
          },
          {
            loader: 'webpack-preprocessor-loader',
            options: {
              params: {
                ENV: (env || {}).ENV,
              },
            },
          },
        ]
      },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader']
      }]
    },
    optimization: {
      splitChunks: {
        maxSize: 300000,
        chunks: 'all'
      }
    }
  };
};
