/**
 * Database restore task.
 * - Restore previous database from backup
 */

'use strict';

module.exports = function (grunt) {

  var async = require('async');
  var path = require('path');

  grunt.registerTask('db:restore', function() {
    var done = this.async();
    var deployTo = grunt.shipit.config.deployTo;
    var environment = getEnvironment();
    var currentPath = path.join(deployTo, 'current');
    var releasesPath = path.join(deployTo, 'releases');
    grunt.shipit.remote('readlink ' + currentPath, function (err, targets) {
      if (err) return done(err);
      var release = targets.map(computeReleaseDirname);
      if (! equalValues(release)){
        return done(new Error('Remote server are not synced.'));
      }
      if(release[0] || release[0].length !== 0){
        var currentRelease = release[0];
        var backupsDir = path.join(deployTo, 'backups');
        var rollbackDir = path.join(deployTo, 'rollbacks');
        var shared = path.join(deployTo, 'shared');
        grunt.shipit.remote('ls -r1 ' + releasesPath, function (err, dirs) {
          if (err) return done(err);
          var releases = dirs.map(computeReleases);
          if (! equalValues(releases)){
            return done(new Error('Remote server are not synced.'));
          }
          releases = releases[0];
          var currentReleaseIndex = releases.indexOf(currentRelease);
          var rollbackReleaseIndex = currentReleaseIndex + 1;
          var releaseDirname = releases[rollbackReleaseIndex];
          var database;
          async.series([
            function(moveon){
              grunt.shipit.remote('cat ' + path.join(shared, 'database.json'), function(err, stdout){
                database = JSON.parse(stdout[0]);
                moveon();
              });
            },
            function(moveon){
              grunt.shipit.remote('mkdir -p ' + rollbackDir, moveon);
            },
            function(moveon){
              grunt.shipit.remote("mysqldump --user='"+database[environment]['username']+"' --password='"+database[environment]['password']+"' --host='"+database[environment]['host']+"' "+database[environment]['database']+" > "+path.join(rollbackDir, currentRelease+".sql"), moveon);
            },
            function(moveon){
              grunt.shipit.remote("mysql --user='"+database[environment]['username']+"' --password='"+database[environment]['password']+"' --host='"+database[environment]['host']+"' "+database[environment]['database']+" < "+path.join(backupsDir, releaseDirname+".sql"), moveon);
            }
          ], done);
        });
      } else {
        done();
      }
    });

    function getEnvironment() {
      var tasks = grunt.cli.tasks[0];
      var environment = tasks.split(":");
      return environment[1];
    };

    function computeReleases(dirs) {
      if (! dirs) return null;

      // Trim last breakline.
      dirs = dirs.replace(/\n$/, '');

      // Convert releases to an array.
      return dirs.split('\n');
    }

    function computeReleaseDirname(target) {
      if (! target) return null;

      // Trim last breakline.
      target = target.replace(/\n$/, '');

      return target.split(path.sep).pop();
    }

    function equalValues(values) {
      return values.every(function (value) {
        return value === values[0];
      });
    }

  });

};



