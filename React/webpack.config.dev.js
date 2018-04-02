import path from 'path'
import webpack from 'webpack'
var combineLoaders = require('webpack-combine-loaders');

export default {
    devtool: 'eval-source-map',
    entry: [
        'webpack-hot-middleware/client',
        path.join(__dirname, '/client/index.js')
    ],
    output: {
        path: '/',
        publicPath: '/',
        filename: 'bundle.js'
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ],
    module: {
    loaders: [{
      test: /\.js$/, 
      loaders: [ 'react-hot-loader', 'babel-loader'],
      include: path.join(__dirname, 'client'),
    }, {

      test: /\.css$/,
      loader: combineLoaders([
        {
          loader: 'style-loader'
        }, {
          loader: 'css-loader',
          query: {
            modules: true,
            localIdentName: '[name]__[local]___[hash:base64:5]'
          }
        }
      ])
    }]
  },
    node: {
        net: 'empty',
        dns: 'empty'
    }
}