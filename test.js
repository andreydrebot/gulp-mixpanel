var assert = require('assert');
var es = require('event-stream');
var File = require('vinyl');

var plugin = require('./');
var config = require('./config');

describe('gulp-mixpanel', function () {
  
  describe('in streaming mode', function () {
    
    it('should prepend mixpanel script', function (done) {      
      var token = "MY_TOKEN";
      var html = new File({
        cwd: '/',
        contents: new es.readArray(["<html><head></head><body></body></html>"])
      });
      
      var mixpanel = plugin(token);
      mixpanel.write(html);
            
      mixpanel.once('data', function (file) {
        assert(file.isStream());
        file.contents.pipe(es.wait(function (err, data) {
          assert.equal(data, '<html><head></head><body>' + config.template.replace(config.key, token) + '</body></html>');
          done();
        }));
      });
    });
    
  });
  
});