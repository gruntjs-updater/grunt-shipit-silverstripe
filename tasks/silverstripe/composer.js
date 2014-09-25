/**
 * Composer task.
 * - Runs a Composer update for the current release
 */

'use strict';

module.exports = function (grunt) {

  var async = require('async');
  var path = require('path');

  grunt.registerTask('ss:composer', function() {
    var done = this.async();
    var current = path.join(grunt.shipit.config.deployTo, 'current');
    grunt.shipit.remote('cd ' + current + ' && php composer.phar update', done);
  });

};



