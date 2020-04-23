const fs = require('fs');
const path = require('path');
const zlip = require('zlib');
const tar = require('tar-stream');
const concat = require('concat-stream');
const { RawSource } = require('webpack-sources');
const ModuleFilenameHelpers = require('webpack/lib/ModuleFilenameHelpers');

class GzipWebpackPlugin {
    constructor(options){
        this.options = Object.assign({
            delSource: true
        },options || {});
        this.pack = tar.pack();
    }

    apply(compiler) {
        let options = this.options;

        compiler.hooks.emit.tapAsync("GzipWebpackPlugin", (compilation, callback) => {
            // default to webpack's root start path if no root provided
            let rootPath = options.root || process.cwd();
            // default to webpack's root output path if no path provided
            let outputPath = options.outPath || process.cwd();
            // default to webpack root filename if no filename provided, else the basename of the output path
            let outputFilename = options.filename || path.basename(outputPath);

            let extension = options.extension || '.tar.gz';

            // combine the output path and filename
            let outputPathAndFilename = path.resolve(
                compilation.options.output.path, // ...supporting both absolute and relative paths
                outputPath,
                path.basename(outputFilename, '.tar.gz') + extension // ...and filenames with and without a .gz extension
            );

            var relativeOutputPath = path.relative(
                compilation.options.output.path,
                outputPathAndFilename
            );

            if (compilation.compiler.isChild()) {
                callback();
                return;
            }
            // populate the gzip file with each asset
            for (let nameAndPath in compilation.assets) {
                if (!compilation.assets.hasOwnProperty(nameAndPath)) continue;

                // match against include and exclude, which may be strings, regexes, arrays of the previous or omitted
                if (!ModuleFilenameHelpers.matchObject({
                    include: options.include,
                    exclude: options.exclude
                }, nameAndPath)) {continue;}
                let outputFilePath = path.resolve(
                    compilation.options.output.path,
                    nameAndPath,
                );

                // Compress only the files below the current root directory
                if (path.relative(rootPath,outputFilePath).includes('..')) {continue;}

                let source = compilation.assets[nameAndPath].source();
                let relativeNameAndPath = path.relative(
                    rootPath,
                    outputFilePath
                );
				
                this.pack.entry({ name: relativeNameAndPath }, source);

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
                        compilation.assets[ relativeOutputPath] = new RawSource(bufs);
                    }
                    callback();
                })
            }));
        });

        compiler.hooks.afterEmit.tap("GzipWebpackPlugin", async (compilation) => {
            try {
                let files = await fs.readdirSync(compilation.options.output.path);
                !files.length && await fs.rmdirSync(compilation.options.output.path);
            } catch (error) {
                compilation.errors.push(error);
            }
        })
    }
}
module.exports = GzipWebpackPlugin;
