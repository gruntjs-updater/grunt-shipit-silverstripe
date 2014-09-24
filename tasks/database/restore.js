/**
 * Database restore task.
 * - Restore previous database from backup
 */

'use strict';

module.exports = function (grunt) {

  var async = require('async');
  var path = require('path');
  var util = require('../../lib/util').init(grunt);

  grunt.registerTask('db:restore', function() {
    var done = this.async();
    var environment = util.getEnvironment();
    grunt.shipit.remote('readlink ' + path.join(util.getConfigOption('deployTo', environment), 'current'), function (err, targets) {
      if (err) {
        grunt.log.error(err);
        done();
      }
      var releaseDirnames = targets.map(computeReleaseDirname);

      if (! equalValues(releaseDirnames)){
        grunt.log.error('Remote server are not synced.');
        done();
      }

      grunt.log.writeln(releaseDirnames[0]);

    });

/*
    grunt.shipit.remote('ls -xr '+path.join(getConfigOption('deployTo', environment), 'releases'), function(err, stdout){
      var releases = stdout[0].trim().split(/\s+/);
      if(releases.length > 1){
        latest_release = releases[0];
        rollback_release = releases[1];
        var backupsDir = path.join(getConfigOption('deployTo', environment), 'backups');
        var shared = getConfigOption('shared', environment);
        var database;
        async.series([
          function(moveon){
            grunt.shipit.remote('cat '+shared+'/database.json', function(err, stdout){
              database = JSON.parse(stdout[0]);
              moveon();
            });
          },
          function(moveon){
            grunt.shipit.remote("mysqldump --user='"+database[environment]['username']+"' --password='"+database[environment]['password']+"' --host='"+database[environment]['host']+"' "+database[environment]['database']+" > "+backupsDir+"/rolled-back-release-"+latest_release+".sql", moveon);
          },
          function(moveon){
            grunt.shipit.remote("mysql --user='"+database[environment]['username']+"' --password='"+database[environment]['password']+"' --host='"+database[environment]['host']+"' "+database[environment]['database']+" < "+backupsDir+"/"+rollback_release+".sql", moveon);
          }
        ], done);
      } else {
        done();
      }
    });
*/
  });

};



