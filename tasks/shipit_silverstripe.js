/*
 * grunt-shipit-silverstripe
 * https://github.com/jeffwhitfield/grunt-shipit-silverstripe
 *
 * Copyright (c) 2014 Jeff Whitfield
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  var path = require('path');

  grunt.loadTasks(path.join(__dirname, 'database'));
  grunt.loadTasks(path.join(__dirname, 'silverstripe'));

  grunt.shipit.on('deploy', function () {
    // Check for branch in cli command
    if (!grunt.option('branch')){
      // Check for branch variable in config, starting with environment
      if(!grunt.shipit.config.branch){
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

};
