var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');
var path = require('path');

module.exports = {
  context: path.join(__dirname, "src"),
  devtool: debug ? "inline-sourcemap" : null,
  entry: "./js/client.js",
  output: {
    path: __dirname + "/src/",
    filename: "client.min.js"
  },
  // plugins: debug ? [] : [
  plugins: [

        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development')
        }),
    // new webpack.optimize.UglifyJsPlugin({
    //   mangle: false,
    //   sourcemap: true,
    //   compress: {
    //     warnings: false,
    //     unused: true,
    //     dead_code: true,
    //     drop_console: true,
    //   }
    // }),
    // new webpack.optimize.UglifyJsPlugin({
    //         compressor: {
    //             warnings: false,
    //             screw_ie8: true
    //         }
    //     }),
    // new webpack.optimize.DedupePlugin(),
    // new webpack.optimize.OccurenceOrderPlugin(),
  ],
  module: {
    loaders: [
      {
        // test: /\.jsx?$/,
        test: /\.js?$/,
        exclude: /(node_modules|bower_components)/,
        // loader: 'babel-loader'
        loader: 'babel'

      },
      {
            test: /\.json?$/,
            loader: 'json'
      },
      {
          test: /\.woff(2)?(\?[a-z0-9#=&.]+)?$/,
          loader: 'url?limit=10000&mimetype=application/font-woff'
      }, {
          test: /\.(ttf|eot|svg)(\?[a-z0-9#=&.]+)?$/,
          loader: 'file'
      }
    ]
  },
};
