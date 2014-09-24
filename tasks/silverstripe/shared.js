/**
 * Shared task.
 * - Updates links from shared files and directories to current release
 */

'use strict';

module.exports = function (grunt) {

  var async = require('async');
  var path = require('path');
  var util = require('../../lib/util').init(grunt);

  grunt.registerTask('ss:shared', function() {
    var done = this.async();
    var environment = util.getEnvironment();
    var deployTo = util.getConfigOption('deployTo', environment);
    var current =  path.join(deployTo, 'current');
    var shared = path.join(deployTo, 'shared');
    var linkedFiles = grunt.config('shipit.options.linkedFiles');
    var linkedDirs = grunt.config('shipit.options.linkedDirs');
    var tasks = "";
    async.eachSeries(linkedFiles, function (file, next) {
      async.series([
        function(moveon){
          grunt.shipit.remote('if test -e ' + path.join(current, file) + '; then rm ' + path.join(current, file) + '; fi', moveon);
        },
        function(moveon){
          grunt.shipit.remote('ln -s ' + path.join(shared, file) + ' ' + path.join(current, file), moveon);
        }
      ], next);
    },
    function(){
      async.eachSeries(linkedDirs, function (dir, next) {
        async.series([
          function(moveon){
            grunt.shipit.remote('if test -e ' + path.join(current, dir) + '; then rm -Rf ' + path.join(current, dir) + '; fi', moveon);
          },
          function(moveon){
            grunt.shipit.remote('ln -s ' + path.join(shared, dir) + ' ' + path.join(current, dir), moveon);
          }
        ], next);
      }, done);
    });
  });

};



