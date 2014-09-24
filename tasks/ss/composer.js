/**
 * Module dependencies.
 */

var async = require('async');
var path = require('path');

/**
 * Composer task.
 * - Runs a Composer update for the current release
 */

module.exports = function (grunt) {

  grunt.registerTask('ss:composer', function() {
    var done = this.async();
    var environment = getEnvironment();
    var current = path.join(getConfigOption('deployTo', environment), 'current');
    grunt.shipit.remote('cd ' + current + ' && php composer.phar update', done);

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



