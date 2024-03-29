const fs = require("fs");
const path = require("path");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// TODO: update lib
// const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin");

// Wordpress TODO: comment this line
const webpack = require("webpack");

const context = path.resolve(__dirname, "src");
const dist = path.resolve(__dirname, "dist");

const scssUtilsPath = "styles/utils";

const templateEntriesDir = path.resolve(context, "templates/pages");

const pugFiles = fs
  .readdirSync(templateEntriesDir)
  .map((file) => file.split(".pug")[0]);

module.exports = {
  context,
  cache: {
    type: "memory",
  },
  devServer: {
    hot: false,
    liveReload: true,
    static: {
      directory: dist,
      // watch: true,
    },
    devMiddleware: {
      stats: {
        assets: false,
        children: false,
        chunks: false,
        hash: false,
        modules: false,
        publicPath: false,
        timings: false,
        version: false,
        warnings: true,
      },
    },
  },
  devtool: "source-map", // 'cheap-module-eval-source-map', - for faster builds
  entry: {
    "js/main": "./scripts/main.js",
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.s?css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: "../",
            },
          },
          {
            loader: "css-loader",
            options: {
              // https://github.com/webpack-contrib/css-loader/issues/228#issuecomment-204607491
              importLoaders: 3,
              sourceMap: true,
            },
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                ident: "postcss",
                plugins: [
                  //
                ],
              },
              sourceMap: true,
            },
          },
          "resolve-url-loader",
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
              sassOptions: {
                sourceComments: true,
              },
            },
          },
          {
            loader: "sass-resources-loader",
            options: {
              resources: [
                path.join(context, `${scssUtilsPath}/_vars.scss`),
                path.join(context, `${scssUtilsPath}/_mixins.scss`),
                path.join(context, `${scssUtilsPath}/_extends.scss`),
              ],
            },
          },
        ],
      },
      {
        test: /\.(ttf|woff|woff2|eot|svg)$/,
        include: path.resolve(context, "icomoon"),
        loader: "file-loader",
        options: {
          name: "[name].[ext]",
          outputPath: "./fonts/icomoon",
          useRelativePath: false,
        },
      },
      {
        test: /^(?!.*\.generated\.ttf$).*\.ttf$/,
        exclude: path.resolve(context, "icomoon"),
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: "fontface-loader",
          },
        ],
      },
      {
        test: /\.generated.(ttf|eot|woff|woff2)$/,
        exclude: path.resolve(context, "icomoon"),
        loader: "file-loader",
        options: {
          name: "[path][name].[ext]",
          outputPath: "./",
        },
      },
      {
        test: /.*\.(gif|png|jpe?g)$/i,
        dependency: { not: ['url'] },
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[path][name].[ext]",
            },
          },
        ],
        type: 'javascript/auto'
      },
      {
        test: /\.(svg|mp4)$/,
        exclude: [
          path.resolve(context, "images/inline"),
          path.resolve(context, "icomoon"),
        ],
        loader: "file-loader",
        options: {
          name: "[path][name].[ext]",
        },
      },
      {
        test: /\.svg$/,
        include: path.resolve(context, "images/inline"),
        loader: "svg-inline-loader",
        options: {
          removeTags: true,
          removingTags: ["title", "desc", "style"],
        },
      },
      {
        test: /\.pug$/,
        loader: "simple-pug-loader",
        options: {
          pretty: true,
          root: path.resolve(__dirname),
        },
      },
    ],
  },
  output: {
    filename: "[name].js",
    path: dist,
  },
  plugins: [
    // Wordpress TODO: comment this line
    new webpack.ProvidePlugin({
      $: "jQuery",
      jQuery: "jQuery",
      "window.jQuery": "jQuery",
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: "./public/", to: "public" }],
    }),
    ...pugFiles.map(
      (file) =>
        new HtmlWebpackPlugin({
          filename: `${file}.html`,
          template: `${templateEntriesDir}/${file}.pug`,
        })
    ),
    // new FaviconsWebpackPlugin({
    //   logo: './images/favicon.png',
    //   prefix: 'favicon/',
    //   persistentCache: true,
    //   inject: true,
    //   background: '#fff',
    //   icons: {
    //     android: true,
    //     appleIcon: true,
    //     appleStartup: true,
    //     coast: false,
    //     favicons: true,
    //     firefox: true,
    //     opengraph: false,
    //     twitter: false,
    //     yandex: false,
    //     windows: true,
    //   },
    // }),
  ],
  resolve: {
    extensions: [".js"],
    alias: {
      "@": path.join(__dirname, "src"),
    },
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "./js/vendor",
          chunks: "all",
        },
      },
    },
    runtimeChunk: {
      name: "./js/manifest",
    },
  },
};
