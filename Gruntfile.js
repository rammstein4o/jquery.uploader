module.exports = function (grunt) {
    'use strict';
    
    var fullYear = new Date().getFullYear();
    
    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);
    
    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);
    
    // Configurable vars
    var config = {
        src: 'src',
        dist: 'dist',
        banner: '/*!\n * jquery.uploader\n\n * Simple HTML5 file uploader\n * Copyright (c) 2017' + (fullYear != 2017 ? '-' + fullYear : '') + ' Radoslav Salov\n * Distributed under MIT license\n * Portions of the project are licensed under Apache 2.0\n * Copyright for portions of the project are held by:\n * CreativeDream (c) 2016 ( https://github.com/CreativeDream/jQuery.filer )\n */\n',
        jshintFiles: ['Gruntfile.js', '<%= config.src %>/*.js'],
        uglifyFiles: {
            '<%= config.dist %>/js/jquery.uploader.min.js': [ '<%= config.src %>/js/jquery.uploader.js' ]
        }
    };
    
    // Define the configuration for all the tasks
    grunt.initConfig({
        // Get package meta data
        pkg: grunt.file.readJSON('package.json'),
        
        // Project settings
        config: config,
        
        // Tasks
        watch: {
            scripts: {
                files: config.jshintFiles,
                tasks: ['jshint']
            }
        },
        
        jshint: {
            options: {
                jshintrc: true
            },
            files: config.jshintFiles
        },
        
        sass: {
            dist: {
                options: {
                    style: 'expanded'
                },
                files: {
                    '<%= config.dist %>/css/jquery.uploader.css': '<%= config.src %>/sass/jquery.uploader.scss'
                }
            }
        },
        
        uglify: {
            dist: {
                options: {
                    compress: {
                        drop_console: true
                    },
                    banner: '<%= config.banner %>',
                    mangle: false,
                    preserveComments: false
                },
                files: config.uglifyFiles
            }
        }
        
    });
    
    grunt.registerTask('default', [
        'jshint',
        'uglify:dist',
        'sass:dist'
    ]);
      
};
