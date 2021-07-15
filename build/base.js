const path = require("path");
const webpack = require("webpack");
const htmlPlugin = require("html-webpack-plugin");
const ENV =  require("parseenv")(path.join(__dirname, "../env/", process.env.WEBPACK_MODE === "development" ? "development.env" : "production.env"));

module.exports = {
    mode: process.env.WEBPACK_MODE,
    entry: path.join(__dirname, "../src/index.js"),
    output: {
        publicPath: process.env.WEBPACK_MODE  === "development" ? "/" : "\./",
        path: path.join(__dirname, "../dist"),
        filename: "js/[name]-[contenthash:4].js"
    },
    resolve: {
        extensions: [".js", ".jsx", ".css", ".less"],
        alias: {
            "@api": path.resolve(__dirname, "../src/api"),
            "@asstes": path.resolve(__dirname, "../src/asstes"),
            "@actions": path.resolve(__dirname, "../src/store/actions"),
            "@util": path.resolve(__dirname, "../src/lib/util.js")
        }
    },
    // node: {
    //     __dirname: true,
    //     __filename: true,
    //     global: true
    // },
    // target: "node-webkit",
    module: {
        rules: [
            {
                test: /\.(jsx|js)$/,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            presets: [
                                "@babel/preset-react",
                                [
                                    "@babel/preset-env",
                                    {
                                      "targets": {
                                        "esmodules": true
                                      }
                                    }
                                ]
                            ]
                        }
                    }
                ]
            },
            {
                test: /\.(svg|eot|ttf|woff|woff2)$/,
                include: [
                    path.resolve(__dirname, "../src/asstes/iconfont")
                ],
                use: [{
                    loader: "file-loader",
                    options:{
                        outputPath: "icon",
                        publicPath: "\.\./icon",
                        name: "[name]-[hash].[ext]"
                    }
                }]
            },
            {
                test: /\.(png|jpg|gif)$/,
                exclude: [
                    path.resolve(__dirname, "../src/asstes/iconfont")
                ],
                use: [{
                    loader: "file-loader",
                    options:{
                        outputPath: "img",
                        name: "[name]-[hash].[ext]"
                    }
                }]
            }
        ]
    },
    plugins: [
        new htmlPlugin({
            minify: process.env.WEBPACK_MODE === "production" ? true : false,
            title: ENV.TITLE,
            filename: "./index.html",
            template: "./src/index.html",
            // favicon: path.resolve('./src/static/img/supplier.ico'),
            hash: true
        }),
        new webpack.DefinePlugin({
            ENV: JSON.stringify(Object.assign(ENV, { WEBPACK_MODE: process.env.WEBPACK_MODE }))
        })
    ]
}