/**
 * Module dependencies.
 */

var async = require('async');
var path = require('path');

/**
 * Database backup task.
 * - Perform backup of current database
 */

module.exports = function (grunt) {

  grunt.registerTask('db:backup', function() {
    var done = this.async();
    var environment = getEnvironment();
    grunt.shipit.remote('ls -xr '+path.join(getConfigOption('deployTo', environment), 'releases'), function(err, stdout){
      var releases = stdout[0].trim().split(/\s+/);
      if(releases[0] || releases[0].length !== 0){
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
            grunt.shipit.remote('mkdir -p '+backupsDir, moveon);
          },
          function(moveon){
            grunt.shipit.remote("mysqldump --user='"+database[environment]['username']+"' --password='"+database[environment]['password']+"' --host='"+database[environment]['host']+"' "+database[environment]['database']+" > "+backupsDir+"/"+releases[0]+".sql", moveon);
          }
        ], done);
      } else {
        done();
      }
    });

    function getEnvironment(){
        var tasks = grunt.cli.tasks[0];
        var environment = tasks.split(":");
        return environment[1];
    }

    function getConfigOption(option, environment){
        return grunt.config('shipit.'+environment+'.'+option) ? grunt.config('shipit.'+environment+'.'+option) : grunt.config('shipit.options.'+option);
    }

  });

};



