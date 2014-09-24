/**
 * Database backup task.
 * - Perform backup of current database
 */

'use strict';

module.exports = function (grunt) {

  var async = require('async');
  var path = require('path');
  var util = require('../../lib/util').init(grunt);

  grunt.registerTask('db:backup', function() {
    var done = this.async();
    var environment = util.getEnvironment();
    var deployTo = util.getConfigOption('deployTo', environment);
    grunt.shipit.remote('ls -xr '+path.join(deployTo, 'releases'), function(err, stdout){
      var releases = stdout[0].trim().split(/\s+/);
      if(releases[0] || releases[0].length !== 0){
        var backupsDir = path.join(deployTo, 'backups');
        var shared = path.join(deployTo, 'shared');
        var database;
        async.series([
          function(moveon){
            grunt.shipit.remote('cat ' + path.join(shared, 'database.json'), function(err, stdout){
              database = JSON.parse(stdout[0]);
              moveon();
            });
          },
          function(moveon){
            grunt.shipit.remote('mkdir -p ' + backupsDir, moveon);
          },
          function(moveon){
            grunt.shipit.remote("mysqldump --user='"+database[environment]['username']+"' --password='"+database[environment]['password']+"' --host='"+database[environment]['host']+"' "+database[environment]['database']+" > "+path.join(backupsDir, releases[0]+".sql"), moveon);
          }
        ], done);
      } else {
        done();
      }
    });
  });

};



