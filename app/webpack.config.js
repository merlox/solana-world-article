const path = require('path')
const htmlPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
    mode: process.env.NODE_ENV,
    devtool: process.env.NODE_ENV === 'production' ? '' : 'eval-source-map',
    entry: [
        '@babel/polyfill',
        path.join(__dirname, 'src', 'index.js')
    ],
    output: {
        path: path.join(__dirname, 'docs'),
        filename: 'build.js',
    },
    module: {
        rules: [{
            loader: 'babel-loader',
            test: /\.jsx?$/,
            exclude: /node_modules/,
            query: {
                presets: ['@babel/preset-env', '@babel/preset-react']
            }
        }, {
            test: /\.styl$/,
            exclude: /node_modules/,
            use: ['style-loader', {
                loader: 'css-loader',
                options: {
                    importLoaders: 2
                }
            }, 'stylus-loader'],
        }, {
            test: /\.css$/,
            use: ['style-loader', 'css-loader'],
        }, {
            test: /\.(woff|woff2|otf|ttf)$/,
            loader: 'url-loader',
            options: {
                name: '[name].[ext]',
                publicPath: './fonts',
                outputPath: '/fonts',
            }
        }, {
            test: /\.(jpe?g|png|gif|svg|mp4)$/i, 
            loader: "file-loader?name=/public/[name].[ext]"
        }]
    },
    plugins: [
        new htmlPlugin({
            title: "Solana Global Article by Merunas",
            favicon: "./assets/favicon.png",
            template: './src/index.ejs',
            hash: true,
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'assets',
                    to: 'assets'
                },
                {
                    from: 'CNAME'
                },
            ]
        })
    ]
}