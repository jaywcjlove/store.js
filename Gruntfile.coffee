module.exports = (grunt) ->
    grunt.loadNpmTasks 'grunt-contrib-watch'
    grunt.loadNpmTasks 'grunt-contrib-uglify'
    grunt.loadNpmTasks 'grunt-contrib-jshint'
    grunt.initConfig(
        pkg: grunt.file.readJSON 'package.json' 
        uglify:
            app_task: 
                options: 
                    beautify: false
                    mangle: true #不混淆变量名
                    compress:false #打开或关闭使用默认选项源压缩。
                files:
                    'build/store.min.js': [
                        'lib/store.js'
                    ]
        jshint: 
            options:
                eqeqeq: true
                trailing: true 
            files: ['lib/store.js']
        watch: 
            another: 
                files: ['lib/store.js']
                tasks: ['jshint','uglify']
                options: 
                    livereload: 1344
    )
    grunt.registerTask 'default', ['watch']
