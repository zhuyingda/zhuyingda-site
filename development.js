var thinkjs = require('thinkjs');
var path = require('path');
var webpack = require('webpack');
var webpackConfig = require('../webpack.config');
var gulp = require('gulp');

var rootPath = path.dirname(__dirname);

var instance = new thinkjs({
  APP_PATH: rootPath + '/app',
  ROOT_PATH: rootPath,
  RESOURCE_PATH: __dirname,
  env: 'development'
});

webpack(webpackConfig, function () {

});

gulp.watch(rootPath+'/fe/**/*', ['webpack']);
gulp.task('webpack', function (cb) {
  webpack(webpackConfig, function () {
    cb();
  });
});

instance.run();