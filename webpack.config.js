'use strict';

const HtmlWebpackPlugin   = require('html-webpack-plugin');
const CopyWebpackPlugin   = require('copy-webpack-plugin');
const path                = require('path');
const CleanWebpackPlugin  = require('clean-webpack-plugin');

module.exports = {
    // Tell Webpack which file kicks off our app.
    entry: path.resolve(__dirname, 'index.js'),
    // Tell Weback to output our bundle to ./dist/bundle.js
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    // Tell Webpack which directories to look in to resolve import statements.
    // Normally Webpack will look in node_modules by default but since we’re overriding
    // the property we’ll need to tell it to look there in addition to the
    // bower_components folder.
    resolve: {
        modules: [
            path.resolve(__dirname, 'node_modules'),
            path.resolve(__dirname, 'bower_components')
        ],
        alias: {
            PolymerElement: '@polymer/polymer/polymer-element.js'
        }
    },
    // These rules tell Webpack how to process different module types.
    // Remember, *everything* is a module in Webpack. That includes
    // CSS, and (thanks to our loader) HTML.
    module: {
        rules: [
            {
                // If you see a file that ends in .html, send it to these loaders.
                test: /\.html$/,
                // This is an example of chained loaders in Webpack.
                // Chained loaders run last to first. So it will run
                // polymer-webpack-loader, and hand the output to
                // babel-loader. This let's us transpile JS in our `<script>` elements.
                use: [
                    { loader: 'babel-loader' },

                ]
            },
            {
                // If you see a file that ends in .js, just send it to the babel-loader.
                test: /\.(js|jsx)$/,
                loader: require.resolve('babel-loader'),

                // Optionally exclude node_modules from transpilation except for polymer-webpack-loader:
                //exclude: /(node_modules)/,
                options: {
                    compact: true,
                },
            },
            {
                test: /\.css$/,
                use: [ 'style-loader', 'css-loader' ]
            },
            {
                loader: 'file-loader',
                // Exclude `js` files to keep "css" loader working as it injects
                // it's runtime that would otherwise processed through "file" loader.
                // Also exclude `html` and `json` extensions so they get processed
                // by webpacks internal loaders.
                exclude: [/\.js$/,/\.ejs$/, /\.html$/, /\.json$/,/\.css$/],
                options: {
                    name: 'assets/[name][hash:8].[ext]',
                },
            },

        ]
    },
    devtool: "inline-source-map",
    // Enable the Webpack dev server which will build, serve, and reload our
    // project on changes.
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: false,
        port: 1812,
        watchOptions: {
            poll: true
        }
    },
    watch: true,
    watchOptions: {
        poll: true
    },
    plugins: [
        // This plugin will generate an index.html file for us that can be used
        // by the Webpack dev server. We can give it a template file (written in EJS)
        // and it will handle injecting our bundle for us.
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src/index.ejs'),
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
            },
        }),
        // we clean the dist folder
        new CleanWebpackPlugin('dist'),

        // This plugin will copy files over for us without transforming them.
        // That's important because the custom-elements-es5-adapter.js MUST
        // remain in ES2015.
        
        // new CopyWebpackPlugin([{
        //     from: path.resolve(__dirname, 'node_modules/@webcomponents/**/*.js'),
        //     to: 'bower_components/webcomponentsjs/[name].[ext]'
        // }]),


    ]
};