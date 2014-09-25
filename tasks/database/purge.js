/**
 * Database purge task.
 * - Purge older backups of database
 */

'use strict';

module.exports = function (grunt) {

  var async = require('async');
  var path = require('path');

  grunt.registerTask('db:purge', function() {
    var done = this.async();
    var keepReleases = grunt.shipit.config.keepReleases;
    var backupsDir = path.join(grunt.shipit.config.deployTo, 'backups');

    grunt.log.writeln('Keeping "%d" last database backups, cleaning others', keepReleases);
    var command = '(ls -r ' + backupsDir +
    '/*|head -n ' + keepReleases + ';ls ' + backupsDir +
    '/*)|sort|uniq -u|xargs rm -f';
    grunt.shipit.remote(command, done);

  });

};



