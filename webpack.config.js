const { name } = require("./package.json");
const { resolve } = require("path");
const webpack = require("webpack");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const { AngularCompilerPlugin } = require("@ngtools/webpack");

const SRC_PATH = resolve(process.cwd(), "src");
const OUTPUT_PATH = resolve(process.cwd(), "build");

module.exports = (env = {}) => {
  const isProd = Boolean(env.prod);
  const isAOT = Boolean(env.aot);
  
  const plugins = isProd
    ? [new CleanWebpackPlugin([OUTPUT_PATH]),
      new webpack.optimize.ModuleConcatenationPlugin(),
      new BundleAnalyzerPlugin({
        analyzerMode: "static",
        openAnalyzer: false
      })]
    : [new webpack.HotModuleReplacementPlugin(),
      // new webpack.ContextReplacementPlugin(/@angular(\\|\/)core(\\|\/)@angular/, SRC_PATH),
      new webpack.NamedModulesPlugin()]

  return {
    entry: {
      app: resolve(SRC_PATH, "main"),
      // polyfills: resolve(SRC_PATH, "polyfills"),
    },
    output: {
      path: OUTPUT_PATH,
      filename: isProd ? "[name].[chunkhash:7].js" : "[name].js",
      chunkFilename: isProd ? "[id].[chunkhash:7].chunk.js" : "[id].chunk.js",
      publicPath: "/"
    },
    "resolve": {
      "extensions": [".ts", ".js", ".json"],
      "alias": {
        "~": SRC_PATH
      },
      "mainFields": [
        "browser",
        "module",
        "main"
      ]
    },
    module: {
      rules: [
        {
          test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
          use: "@ngtools/webpack",
          exclude: [/\.(spec|e2e)\.ts$/]
        },
        { test: /\.html$/, use: "raw-loader" },
        {
          test: /.css$/,
          use: [
            "style-loader",
            {
              loader: "css-loader",
              options: {
                importLoaders: 1,
                // modules: true
              },
            },
            {
              loader: "postcss-loader",
              options: {
                plugins: [
                  require("autoprefixer"),
                  require("postcss-nested"),
                ]
              }
            }
          ]
        },
        {
          test: /\.(eot|svg|cur)$/,
          loader: "file-loader",
          options: {
            name: "[name].[hash:7].[ext]",
            limit: 10000,
          },
        },
        {
          test: /\.(jpg|png|webp|gif|otf|ttf|woff|woff2|ani)$/,
          loader: "url-loader",
          options: {
            name: "[name].[hash:7].[ext]",
            limit: 10000,
          },
        },
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(isProd ? "production" : "development")
      }),
      new HtmlWebpackPlugin({
        title: name,
        template: resolve(SRC_PATH, "index.ejs")
      }),
      new AngularCompilerPlugin({
        tsConfigPath: resolve(SRC_PATH, "tsconfig.app.json"),
        mainPath: "./main.ts",
        skipCodeGeneration: !isAOT
      }),
    ].concat(plugins),
    devtool: isProd ? "hidden-source-map" : "source-map",
    devServer: {
      hot: true,
      compress: true,
      contentBase: SRC_PATH,
      // historyApiFallback: true,
      overlay: true
    },
  }
}