var through = require('through2');
var gutil = require('gulp-util');
var rs = require('replacestream');
var PluginError = gutil.PluginError;

var PLUGIN_NAME = 'gulp-mixpanel';

function gulpMixpanel(mixpanelToken) {
  if (!mixpanelToken) {
    throw new PluginError(PLUGIN_NAME, 'Missing mixpanel token!');
  }

  var config = require('./config');

  var stream = through.obj(function (file, enc, cb) {
    if (file.isBuffer()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Buffers not supported!'));
      return cb();
    }

    if (file.isStream()) {
      file.contents = file.contents.pipe(rs('</body>', config.template.replace(config.key, mixpanelToken) + '</body>'));
    }

    this.push(file);
    cb();
  });

  return stream;
}

module.exports = gulpMixpanel;