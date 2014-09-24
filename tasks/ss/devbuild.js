/**
 * Module dependencies.
 */

var async = require('async');
var path = require('path');

/**
 * Dev/Build task.
 * - Runs a SilverStripe dev/build process
 */

module.exports = function (grunt) {

  grunt.registerTask('ss:devbuild', function() {
    var done = this.async();
    var environment = getEnvironment();
    var current = path.join(getConfigOption('deployTo', environment), 'current');
    var server = getConfigOption('servers', environment).split('@');
    var host = server.length > 1 ? server[1] : server[0];
    async.series([
      function(moveon){
        grunt.shipit.remote('cd ' + current + ' && php framework/cli-script.php dev/build && rm -R ./silverstripe-cache/*', moveon);
      },
      function(moveon){
        grunt.shipit.remote('curl http://'+host+'/?flush=all&env_type=dev', moveon);
      }
    ], done);

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
