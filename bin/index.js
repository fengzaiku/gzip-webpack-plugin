const path = require('path');
const zlip = require('zlib');
const tar = require('tar-stream');
const concat = require('concat-stream');
const { RawSource } = require('webpack-sources');
const ModuleFilenameHelpers = require('webpack/lib/ModuleFilenameHelpers');

class GzipWebpackPlugin {
    constructor(options){
        this.options = options || {};
        this.pack = tar.pack();
    }

    apply(compiler) {
        let options = this.options;

        compiler.hooks.emit.tapAsync("GzipWebpackPlugin", (compilation, callback) => {

            // default to webpack's root output path if no path provided
            let outputPath = options.path || compilation.options.output.path;
            // default to webpack root filename if no filename provided, else the basename of the output path
            let outputFilename = options.filename || path.basename(outputPath);

            let extension = '.' + (options.extension || 'gz');

            // combine the output path and filename
            let outputPathAndFilename = path.resolve(
                compilation.options.output.path, // ...supporting both absolute and relative paths
                outputPath,
                path.basename(outputFilename, '.gz') + extension // ...and filenames with and without a .gz extension
            );

            var relativeOutputPath = path.relative(
                compilation.options.output.path,
                outputPathAndFilename
            );


            if (compilation.compiler.isChild()) {
                callback();
                return;
            }
            // populate the zip file with each asset
            for (let nameAndPath in compilation.assets) {
                if (!compilation.assets.hasOwnProperty(nameAndPath)) continue;

                // match against include and exclude, which may be strings, regexes, arrays of the previous or omitted
                if (!ModuleFilenameHelpers.matchObject({
                    include: options.include,
                    exclude: options.exclude
                }, nameAndPath)) continue;

                let source = compilation.assets[nameAndPath].source();

                this.pack.entry({ name: nameAndPath }, source);
                // Delete the source
                if (options.delSource) {
                    delete compilation.assets[nameAndPath];
                }
            }
            this.pack.finalize();

            this.pack.pipe(concat(function (data) {
                zlip.gzip(data, options.zlibOptions || {}, function (err, bufs) {
                    if (err) {
                        compilation.errors.push(error);
                    } else {
                        compilation.assets[relativeOutputPath] = new RawSource(bufs);
                    }
                    callback();
                })
            }));
        })
    }
}
module.exports = GzipWebpackPlugin;
