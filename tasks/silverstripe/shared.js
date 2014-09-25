/**
 * Shared task.
 * - Updates links from shared files and directories to current release
 */

'use strict';

module.exports = function (grunt) {

  var async = require('async');
  var path = require('path');

  grunt.registerTask('ss:shared', function() {
    var done = this.async();
    var deployTo = grunt.shipit.config.deployTo;
    var current =  path.join(deployTo, 'current');
    var shared = path.join(deployTo, 'shared');
    var linkedFiles = grunt.shipit.config.linkedFiles;
    var linkedDirs = grunt.shipit.config.linkedDirs;
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



