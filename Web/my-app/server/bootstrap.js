require('ignore-styles');
require('babel-polyfill');
require('babel-register')({
    extensions: [".es6", ".es", ".jsx", ".js", ".ts", ".tsx"],
    ignore: [ /(node_modules)/ ],
    plugins: [
        'syntax-dynamic-import',
        'dynamic-import-node',
        'react-loadable/babel'
    ],
    presets: [
        ["env", {
            "targets": {
                "node": "current"
            }
        }],
        'react-app'
    ]
});
require('./index');