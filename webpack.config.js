const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer-sunburst').BundleAnalyzerPlugin;


module.exports = (env, arg) => ({
    entry: ['./src/app.js','./src/sass/base.scss'],
    output: {
      filename: "main.bundle.js",
      path: path.resolve(__dirname, 'dist')
    },
    devtool: arg.mode != 'production' ? 'eval-source-map': 'nosources-source-map',
    module: {
        rules: [{ 
          test: /\.(js|jsx)$/, 
          use: ['babel-loader'],
          exclude: /node_modules/,
        }, {
          test: /\.(jpe|jpg|png)(\?.*$|$)/,
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]',
          }
        }, 
        {
           test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
           loader: "url-loader?limit=10000&minetype=application/font-woff",
           options: {
            name: '[path][name].[ext]',
          }
        },
        { 
          test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, 
          loader: "file-loader",
          options: {
            name: '[path][name].[ext]',
          }
        },
        {
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
        }, {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        }
      ]
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      alias: {
        'react-dom': '@hot-loader/react-dom',
      }
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: 'index.html',
            favicon: "./assets/icons/rule.ico"
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css'
        }),
        /* new BundleAnalyzerPlugin({
            analyzerMode: 'static',
        }), */
    ]
});
