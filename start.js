/**
 * 每次启动app.js前自动让Babel转码es7至es6
 */
var babelpolyfill = require("babel-polyfill");
var register = require('babel-core/register');

register({
    presets: ['stage-3']
});

require('./app.js');