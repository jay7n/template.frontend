var path = require('path')
var webpack = require('webpack')

var ExtractTextPlugin = require('extract-text-webpack-plugin')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

var Conf = require('../conf')


module.exports = (function() {
    var baseConfig = {
        entry: {
            app: ['babel-polyfill', path.resolve(Conf.RootPath, 'source', 'main.js')]
        },
        output: {
            path: Conf.DistPath,
            filename: '[name].js',
        },
        resolve: {
            extensions: ['.js'],
            alias: {
                '@': path.resolve(Conf.RootPath, 'source'),
            },
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    include: [path.resolve(Conf.RootPath, 'source')],
                    loader: 'eslint-loader',
                    enforce: 'pre',
                    options: {
                        formatter: require('eslint-friendly-formatter'),
                    }
                },
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                },
                {
                    test: /\.css$/,
                    use:  ExtractTextPlugin.extract({
                        fallback: "style-loader",
                        use: "css-loader"
                    })
                },
                {
                    test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: 'img/[name].[hash:7].[ext]'
                    }
                },
                {
                    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: 'fonts/[name].[hash:7].[ext]'
                    }
                },
            ],
        },
        plugins: [
            new webpack.HashedModuleIdsPlugin(),

            // split vendor js into its own file
            new webpack.optimize.CommonsChunkPlugin({
                name: 'vendor',
                minChunks: function (module) {
                    // any required modules inside node_modules are extracted to vendor
                    const cond = (
                        module.resource &&
                        /\.js$/.test(module.resource) && (
                            module.resource.indexOf(path.resolve(Conf.RootPath, 'node_modules')) !== -1 ||
                            module.resource.indexOf(path.resolve(Conf.RootPath, 'third')) !== -1
                        )
                    )

                    return cond
                }
            }),

            // extract webpack runtime and module manifest to its own file in order to
            // prevent vendor hash from being updated whenever app bundle is updated
            new webpack.optimize.CommonsChunkPlugin({
                name: 'manifest',
                chunks: ['vendor']
            }),
            new ExtractTextPlugin("styles.css"),
            new FriendlyErrorsPlugin(),
        ]
    }

    return baseConfig
})()
