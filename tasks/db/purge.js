/**
 * Module dependencies.
 */

var async = require('async');

/**
 * Database purge task.
 * - Purge older backups of database
 */

module.exports = function (grunt) {

  grunt.registerTask('db:purge', function() {
    var done = this.async();
    var environment = getEnvironment();
    var keepReleases = grunt.config('shipit.options.keepReleases');
    var deployTo = getConfigOption('deployTo', environment);
    grunt.shipit.remote('ls -x '+deployTo+'/backups/*', function(err, stdout){
      var backups = stdout[0].trim().split(/\s+/);
      if(backups.length > keepReleases){
        async.times(backups.length - keepReleases, function(n, next){
          grunt.shipit.remote('rm '+backups[n], next);
        }, done);
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



