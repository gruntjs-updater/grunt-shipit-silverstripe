/**
 * Database backup task.
 * - Perform backup of current database
 */

'use strict';

module.exports = function (grunt) {

  var async = require('async');
  var path = require('path');

  grunt.registerTask('db:backup', function() {
    var done = this.async();
    var deployTo = grunt.shipit.config.deployTo;
    var currentPath = path.join(deployTo, 'current');
    var environment = getEnvironment();
    grunt.shipit.remote('readlink ' + currentPath, function (err, targets) {
      if (err) return done(err);
      var release = targets.map(computeReleaseDirname);
      if (! equalValues(release)){
        return done(new Error('Remote server are not synced.'));
      }
      if(release[0] || release[0].length !== 0){
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
            grunt.shipit.remote("mysqldump --user='"+database[environment]['username']+"' --password='"+database[environment]['password']+"' --host='"+database[environment]['host']+"' "+database[environment]['database']+" > "+path.join(backupsDir, release[0]+".sql"), moveon);
          }
        ], done);
      } else {
        done();
      }
    });

    function getEnvironment() {
      var tasks = grunt.cli.tasks[0];
      var environment = tasks.split(":");
      return environment[1];
    };

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



