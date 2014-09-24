/**
 * Module dependencies.
 */

var async = require('async');

/**
 * Shared task.
 * - Updates links from shared files and directories to current release
 */

module.exports = function (grunt) {

  grunt.registerTask('ss:shared', function() {
    var done = this.async();
    var environment = getEnvironment();
    var current = getConfigOption('deployTo', environment) + '/current';
    var shared = getConfigOption('shared', environment);
    var linkedFiles = grunt.config('shipit.options.linkedFiles');
    var linkedDirs = grunt.config('shipit.options.linkedDirs');
    var tasks = "";
    async.eachSeries(linkedFiles, function (file, next) {
      async.series([
        function(moveon){
          grunt.shipit.remote('if test -e ' + current + '/' + file + '; then rm ' + current + '/' + file + '; fi', moveon);
        },
        function(moveon){
          grunt.shipit.remote('ln -s ' + shared + '/' + file + ' ' + current + '/' + file, moveon);
        }
      ], next);
    },
    function(){
      async.eachSeries(linkedDirs, function (dir, next) {
        async.series([
          function(moveon){
            grunt.shipit.remote('if test -e ' + current + '/' + dir + '; then rm -Rf ' + current + '/' + dir + '; fi', moveon);
          },
          function(moveon){
            grunt.shipit.remote('ln -s ' + shared + '/' + dir + ' ' + current + '/' + dir, moveon);
          }
        ], next);
      }, done);
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



