const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const smp = new SpeedMeasurePlugin();

module.exports = smp.wrap({
    entry: {
        index: './src/index.js',
    },
    output: {
        filename: '[name].[hash].js',
        path: path.resolve(__dirname, 'dist'),
        chunkFilename: '[name].[chunkhash].js',
    },
    module: {
        rules: [
            {
                test: /\.(png|jpe?g|gif)$/i,
                loader: 'file-loader',
                options: {
                    outputPath: 'dist',
                },
            },
            {
                test: /\.(sass|scss|css|less)/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    "less-loader",
                ],
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    // "thread-loader",
                    {
                        loader: "babel-loader",
                        options: {
                            cacheDirectory: true,
                            presets: ["@babel/preset-env", "@babel/preset-react"]  //用于解析ES6+React
                        }
                    },
                ]

            }
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',       //生成的文件名
            chunks: ['index'],
            favicon:'./public/favicon.png'
        }),
        new MiniCssExtractPlugin({
            //使用contenthash，根据css的内容生成hash
            filename: '[name].[contenthash].css'
        }),
    ],
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                test: /\.js$/,
                exclude: /node_modules/,
                cache: true,
                parallel: true
            }),
        ],
        // splitChunk的默认配置，也是最佳实践，如果填{}会使用默认配置
        splitChunks: {
            // 缓存组公共配置
            chunks: "all",
            minSize: 30000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '~',
            name: true,
            cacheGroups: {
                // 你定义的缓存组，获取公共配置加上以下配置去匹配chunk
                vendors: {
                    // 匹配node_modules
                    test: /[\\/]node_modules[\\/]/,
                    // 缓存组优先级 -10 > -20
                    priority: -10,
                    name: "vendor"
                },
                commons: {
                    // 至少两个chunk引入的模块会被拆分出去
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true,
                    name: "common"
                }
            }
        },
    },
});
