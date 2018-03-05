var gulp = require('gulp');
var babel = require('gulp-babel');
var nodemon = require('gulp-nodemon');

gulp.task('build', function() {
    return gulp.src('src/**/*.js')
        .pipe(babel())
        .pipe(gulp.dest('dist'));
});

gulp.task('dev', ['build'], function() {
    return nodemon({
        script: 'dist/index.js',
        ext: 'js',
        ignore: ['dist/'],
        env: { 'NODE_ENV': 'development' },
        tasks: ['build']
    })
});
