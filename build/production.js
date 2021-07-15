const { CleanWebpackPlugin } = require("clean-webpack-plugin");//打包前删除ouput目录之前的打包文件的插件
const miniCssPlugin = require("mini-css-extract-plugin");//分离css文件插件
const ocawp = require("optimize-css-assets-webpack-plugin");//压缩css文件插件
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const { merge } = require("webpack-merge");
const base = require("./base");

module.exports = merge(base, {
    optimization: {
        runtimeChunk: "single",
        splitChunks: {
            chunks: "all",
            minSize: 1,
            minChunks: 1,
            cacheGroups: {
                comm: {
                    test: /.*\/node_modules\/.*/,
                    name: "comm",
                    priority: 1
                },
                // wangeditor: {
                //     test: /.*\/wangeditor\/.*/,
                //     name: "wangeditor",
                //     priority: 2
                // }
            }
        }
    },
    module: {
        rules: [
            {
                test: /\.less$/,
                use: [
                    {
                        loader: miniCssPlugin.loader,
                    },
                    "css-loader", 
                    "less-loader"
                ]
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: miniCssPlugin.loader,
                    }, 
                    "css-loader"
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new miniCssPlugin({
            filename: "css/[name]-[contenthash-4].css",
            chunkFilename: "[id].css"
        }),
        new ocawp({
            assetNameRegExp: /\.css$/,
            cssProcessor: require('cssnano'),
        }),
        new BundleAnalyzerPlugin({ analyzerMode: "static" })
    ]
});