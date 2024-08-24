const path = require('path');

module.exports = {
  entry: './src/server/index.tsx',
  target: 'node',
  // externals: [nodeExternals()],
  output: {
    path: path.resolve('server-build'),
    filename: 'index.js'
  },
  resolve:{
    extensions:['.js','.jsx','.ts','.tsx'],
    alias: {
      '@':path.resolve(__dirname,'../src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options:{
          "presets": [
              "@babel/preset-env",
          ],
          "plugins": [
              [
                  "@babel/plugin-proposal-decorators",
                  {
                      "legacy": true,
                  }
              ],
              [
                  "@babel/plugin-transform-class-properties",
              ],
              [
                  "@babel/plugin-transform-private-methods",
              ],
              [
                  "@babel/plugin-transform-private-property-in-object",
              ]
          ],
        }
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader'
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
      {
        test: /\.svg$/,
        loader: 'svg-url-loader'
      }
    ]
  }
};