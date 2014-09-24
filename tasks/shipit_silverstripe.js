/*
 * grunt-shipit-silverstripe
 * https://github.com/jeffwhitfield/grunt-shipit-silverstripe
 *
 * Copyright (c) 2014 Jeff Whitfield
 * Licensed under the MIT license.
 */

var path = require('path');

'use strict';

module.exports = function(grunt) {

  grunt.loadTasks(path.join(__dirname, 'db'));
  grunt.loadTasks(path.join(__dirname, 'ss'));

  grunt.shipit.on('deploy', function () {
    // Check for branch in cli command
    if (!grunt.option('branch')){
      var environment = getEnvironment();
      // Check for branch variable in config, starting with environment
      if(grunt.config('shipit.'+environment+'.branch')){
        grunt.shipit.config.branch = grunt.config('shipit.'+environment+'.branch');
      } else if(grunt.config('shipit.options.branch')){
        grunt.shipit.config.branch = grunt.config('shipit.options.branch');
      } else {
        throw new Error('You must specify a branch using --branch.');
      }
    } else {
      grunt.shipit.config.branch = grunt.option('branch');
    }

    grunt.task.run([
      'db:backup',
      'db:purge'
    ]);

  });

  grunt.shipit.on('published', function () {
    grunt.task.run([
      'ss:shared',
      'ss:composer',
      'ss:devbuild'
    ]);
  });

  grunt.shipit.on('rollback', function () {
    grunt.task.run([
      'db:restore'
    ]);
  });

  function getEnvironment(){
    var tasks = grunt.cli.tasks[0];
    var environment = tasks.split(":");
    return environment[1];
  }

};
