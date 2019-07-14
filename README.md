# gzip-webpack-plugin
    webpack gz文件夹/文件压缩插件

## Installation
    Webpack 版本需要 >4.0:

    npm install --save-dev gzip-webpack-plugin

## Usage
    webpack.config.js
```javascript
    const GzipWebpackPlugin = require('gzip-webpack-plugin');

    module.exports = {
      // ...
      plugins: [
        new GzipWebpackPlugin({
          // 压缩文件输出路径，默认webpack output path
          path: process.cwd(),
    
          // 压缩文件输出名字，默认为webpack输出目录名称
          filename: 'my_app.zip',
    
          // 压缩文件扩展名，默认是.gz
          extension: '.gzip',
          
          // 是否删除源文件    
          delSource: false,
          
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


````
