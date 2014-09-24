/**
 * Database purge task.
 * - Purge older backups of database
 */

'use strict';

module.exports = function (grunt) {

  var async = require('async');
  var path = require('path');
  var util = require('../../lib/util').init(grunt);

  grunt.registerTask('db:purge', function() {
    var done = this.async();
    var environment = util.getEnvironment();
    var keepReleases = grunt.config('shipit.options.keepReleases');
    var deployTo = util.getConfigOption('deployTo', environment);
    grunt.shipit.remote('ls -x ' + path.join(deployTo, 'backups', '*'), function(err, stdout){
      var backups = stdout[0].trim().split(/\s+/);
      if(backups.length > keepReleases){
        async.times(backups.length - keepReleases, function(n, next){
          grunt.shipit.remote('rm '+backups[n], next);
        }, done);
      } else {
        done();
      }
    });
  });

};



