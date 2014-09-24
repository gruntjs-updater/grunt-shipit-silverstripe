'use strict';

exports.init = function(grunt) {
  var exports = {};

  /**
   * Returns the current environment (ie. staging, production, etc.)
   */
  exports.getEnvironment = function() {
    var tasks = grunt.cli.tasks[0];
    var environment = tasks.split(":");
    return environment[1];
  };


  /**
   * Returns value of option based on environment.
   * @param {String} option Name of option.
   */
  exports.getConfigOption = function(option, environment) {
    return grunt.config('shipit.'+environment+'.'+option) ? grunt.config('shipit.'+environment+'.'+option) : grunt.config('shipit.options.'+option);
  };

  return exports;
}


