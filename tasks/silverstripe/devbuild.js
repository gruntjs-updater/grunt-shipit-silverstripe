/**
 * Dev/Build task.
 * - Runs a SilverStripe dev/build process
 */

'use strict';

module.exports = function (grunt) {

  var async = require('async');
  var path = require('path');
  var util = require('../../lib/util').init(grunt);

  grunt.registerTask('ss:devbuild', function() {
    var done = this.async();
    var environment = util.getEnvironment();
    var current = path.join(util.getConfigOption('deployTo', environment), 'current');
    var server = util.getConfigOption('servers', environment).split('@');
    var optionHost = util.getConfigOption('host', environment);
    var host = optionHost ? optionHost : (server.length > 1 ? server[1] : server[0]);
    async.series([
      function(moveon){
        grunt.shipit.remote('cd ' + current + ' && php framework/cli-script.php dev/build && rm -R ./silverstripe-cache/*', moveon);
      },
      function(moveon){
        grunt.shipit.remote('curl http://'+host+'/?flush=all&env_type=dev', moveon);
      }
    ], done);
  });

};
