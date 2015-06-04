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

    var
      script = config.template.replace(config.key, mixpanelToken),
      content = undefined
      ;

    if (file.isBuffer()) {
      content = file.contents.toString('utf8');
      content = content.replace('</body>', script + '</body>');
      file.contents = new Buffer(content);
    }

    if (file.isStream()) {
      file.contents = file.contents.pipe(rs('</body>', script + '</body>'));
    }

    this.push(file);
    cb();
  });

  return stream;
}

module.exports = gulpMixpanel;