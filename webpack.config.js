// This is the dev config
// To disable the hot-reload feature, remove lines with this comment: ## DEV-SERVER ##

//require our dependencies
const path = require('path')
const webpack = require('webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    //the base directory (absolute path) for resolving the entry option
    context: __dirname,

    // we don't specify the extension now, because we will later in the `resolve` section
    entry: {
        'twocylinder':'./src/build.js',
        'twocylinder.min':'./src/build.js'
    },
    devtool: "source-map",
    output: {
        //where we want our compiled bundle to be stored
        path: path.resolve('./dist'),
        filename: "[name].js",
        library: 'twocylinder',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },

    module: {
        rules: [
            {
                //a regexp that tells webpack use the following loaders on all
                //.js and .jsx files
                test: /\.js$/,

                // we don't want babel to transpile all the files in node_modules
                exclude: /node_modules/,

                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    },

    optimization: {
        minimize: true,
        minimizer: [new UglifyJsPlugin({
            include: /\.min\.js$/
        })]
    },

    resolve: {
        //extensions that should be used to resolve modules
        extensions: ['.js']
    }
}

