const path = require('path');
const GzipWebpackPlugin = require('../bin/index.js');
console.log(path.join(__dirname, 'test.js'))
module.exports = {
    mode: "development",
    entry: path.join(__dirname, 'test.js'),
    output: {
        path: path.resolve(__dirname,'..', 'dist'),
        filename: "bundle.js"
    },
    plugins: [
        new GzipWebpackPlugin({
            delSource: true
        }),
    ]
};
