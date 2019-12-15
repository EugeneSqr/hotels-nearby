const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {
  const mode = argv.mode;
  return {
    devtool: mode === 'development' ? 'source-map' : undefined,
    entry: './src/index.js',
    plugins: [
      new HtmlWebpackPlugin({title: 'Hotels nearby', template: './src/index.html'}),
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
          'preprocess-loader',
          {
            loader: 'eslint-loader',
            options: {
              emitWarning: true,
            },
          },
        ]
      }, {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader']
      }, {
        test: /\.(png|svg|jpg|gif)$/,
        use: 'file-loader',
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
