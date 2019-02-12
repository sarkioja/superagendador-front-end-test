var gulp = require('gulp'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    terser = require('gulp-terser'),
    usemin = require('gulp-usemin'),
    cssmin = require('gulp-cssmin'),
    browserSync = require('browser-sync'),
    jshint = require('gulp-jshint'),
    jshintStylish = require('jshint-stylish'),
    csslint = require('gulp-csslint'),
    autoprefixer = require('gulp-autoprefixer'),
    stylus = require('gulp-stylus');

gulp.task('default', ['copy'], function() {
  gulp.start('usemin');
  gulp.start('server');
});

gulp.task('copy', ['clean'], function() {
  return gulp.src('src/**/*')
             .pipe(gulp.dest('dist'));
});

gulp.task('clean', function() {
  return gulp.src('dist')
             .pipe(clean());
});

gulp.task('usemin', function() {
  return gulp.src('dist/*.html')
             .pipe(usemin({
               css: [autoprefixer, cssmin],
               js: [terser]
             }))
             .pipe(gulp.dest('dist'));
});

gulp.task('server', function() {
  browserSync.init({
    server: {
      baseDir: 'dist'
    }
  });

  gulp.watch('src/**/*').on('change', browserSync.reload);

  gulp.watch('src/assets/**/*.js').on('change', function(event) {
    console.log("Linting " + event.path);
    gulp.src(event.path)
        .pipe(jshint({esversion: 6}))
        .pipe(jshint.reporter(jshintStylish));
  });

  gulp.watch('src/assets/**/*.css').on('change', function(event) {
    console.log("Linting " + event.path);
    gulp.src(event.path)
        .pipe(csslint())
        .pipe(csslint.reporter());
  });

  gulp.watch('src/assets/**/style.styl').on('change', function(event) {
    gulp.src(event.path)
        .pipe(stylus().on('error', function(erro) {
          console.log('Stylus - Erro compilação: ' + erro.filename);
          console.log(erro.message);
        }))
        .pipe(gulp.dest('src/assets/css'));
  });
});
