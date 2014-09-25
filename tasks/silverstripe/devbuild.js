/**
 * Dev/Build task.
 * - Runs a SilverStripe dev/build process
 */

'use strict';

module.exports = function (grunt) {

  var async = require('async');
  var path = require('path');

  grunt.registerTask('ss:devbuild', function() {
    var done = this.async();
    var current = path.join(grunt.shipit.config.deployTo, 'current');
    var server = grunt.shipit.config.servers.split('@');
    var optionHost = grunt.shipit.config.host;
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
