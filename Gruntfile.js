'use strict';
module.exports = function (grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
    grunt.initConfig({
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'lib/*.js',
                'test/*.js'
            ]
        },
        mochaTest: {
            files: [
                'test/*.js'
            ]
        },
        mochaTestConfig: {
            options: {
                reporter: 'spec'
            }
        }
    });
    grunt.registerTask('test', ['jshint', 'mochaTest']);
    grunt.registerTask('default', 'test');
};
