# gzip-webpack-plugin
    webpack tar.gz文件/文件夹压缩插件

## Installation
    Webpack >=4.0:

    npm install --save-dev gzip-webpack-plugin

## Usage
    webpack.config.js
```javascript
    const GzipWebpackPlugin = require('gzip-webpack-plugin');

    module.exports = {
      // ...
      plugins: [
        new GzipWebpackPlugin({
          // 压缩文件打包起始路径，默认process.cwd()
          root: process.cwd(),
          
          // 压缩文件输出路径，默认process.cwd()
          outPath: process.cwd(),
    
          // 压缩文件输出名字，默认为webpack输出目录名称
          filename: 'my_app',
    
          // 压缩文件扩展名，默认是.tar.gz
          extension: '.gzip',
          
          // 是否删除源文件, 默认为true    
          delSource: true,
          
          // 输入需要压缩文件/文件夹名称正则、字符串或数组名称。默认会压缩webpack输出目录下得所有文件
          include: [/\.js/],
    
          // 不需要压缩的文件夹名称，配置同include
          exclude: [/\.css/],
          
          // 详细可查看:http://nodejs.cn/api/zlib.html#zlib_class_options
          zlibOptions: {
            // ...
          },
        })
      ]
    };
```

## Example

````javascript
    const path = require('path');
    const GzipWebpackPlugin = require('gzip-webpack-plugin');
   
    module.exports = {
        mode: "development",
        entry: path.join(__dirname, 'test.js'),
        output: {
            path: path.resolve(__dirname,'dist'),
            filename: "bundle.js"
        },
        plugins: [
            new GzipWebpackPlugin(),
        ]
    };
````
