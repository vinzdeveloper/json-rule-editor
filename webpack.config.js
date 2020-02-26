const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const path = require('path');
module.exports = {
    entry: {
      app: './src/app.js',
      style: './src/sass/base.scss'
    },
    output: {
      filename: "main.bundle.js",
      path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [{ 
          test: /\.(js|jsx)$/, 
          use: ['react-hot-loader/webpack', 'babel-loader'],
          exclude: /node_modules/
        },{
          test: /\.(jpe|jpg|woff|woff2|eot|ttf|svg|png)(\?.*$|$)/,
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]',
          }
        }, {
          test: /\.scss$/,
          use: [
          { loader: MiniCssExtractPlugin.loader }, 
          { loader: "css-loader" },
          { loader: "sass-loader",
            options: {
              sourceMap: false
            }
          }],
          exclude: /node_modules/,
          
        },{
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        }
      ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: 'index.html'
        }),
        new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css'
        })
    ]
};
