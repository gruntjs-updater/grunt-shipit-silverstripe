/**
 * Composer task.
 * - Runs a Composer update for the current release
 */

'use strict';

module.exports = function (grunt) {

  var async = require('async');
  var path = require('path');
  var util = require('../../lib/util').init(grunt);

  grunt.registerTask('ss:composer', function() {
    var done = this.async();
    var environment = util.getEnvironment();
    var current = path.join(util.getConfigOption('deployTo', environment), 'current');
    grunt.shipit.remote('cd ' + current + ' && php composer.phar update', done);
  });

};



