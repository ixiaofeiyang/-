const path = require('path');

module.exports = {
    'target':'dist',
    'source':'src',
    'wpyExt': '.vue',
    resolve: {
      alias: {
        '@': path.join(__dirname, 'src')
      },
      aliasFields: ['wepy'],
      modules: ['node_modules']
    },
    'compilers': {
        less: {
            'compress': true
        },
        sass: {
            outputStyle: "compressed"
        },
        babel: {
            sourceMap: false,
            presets: [
                'env'
            ],
            plugins: [
                'transform-class-properties',
                'transform-decorators-legacy',
                'transform-object-rest-spread',
                'transform-export-extensions',
            ]
        }
    },
    'plugins': {

    }
};

// 压缩js
module.exports.plugins = {
    'uglifyjs': {
        filter: /\.js$/,
        config: {
        }
    },
    'imagemin': {
        filter: /\.(jpg|png|jpge)$/,
        config: {
            'jpg': {
                quality: 80
            },
            'png': {
                quality: 80
            }
        }
    }
};
