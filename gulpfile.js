var gulp = require('gulp'),
  gutil = require('gulp-util'),
  jshint = require('gulp-jshint'),
  scsslint = require('gulp-scss-lint'),
  csslint = require('gulp-csslint'),
  browserify = require('gulp-browserify'),
  sass = require('gulp-sass'),
  connect = require('gulp-connect'),
  gulpif = require('gulp-if'),
  uglify = require('gulp-uglify'),
  minifyHTML = require('gulp-htmlmin'),
  cssnano = require('gulp-cssnano'),
  jsonminify = require('gulp-jsonminify'),
  concat = require('gulp-concat'),
  changed = require('gulp-changed');

var bourbon = require('node-bourbon');
  bourbon.includePaths
var neat = require('node-neat');
  neat.includePaths // Array of Neat paths (including Bourbon)

// var gulpLoadPlugins = require('gulp-load-plugins'),
//     plugins = gulpLoadPlugins();

var env,
  jsSources,
  sassSources,
  htmlSources,
  jsonSources,
  outputDir,
  sassStyle;

var env = process.env.NODE_ENV || 'development';

if (env==='development') {
  outputDir = 'builds/development/';
  sassStyle = 'expanded';
} else {
  outputDir = 'builds/production/';
  sassStyle = 'compact';
}

jsSources = [
  
];
sassSources = ['components/sass/**/*.scss'];
htmlSources = [outputDir + '*.html'];
jsonSources = ['builds/development/js/*.json'];

gulp.task('js', function () {
  gulp.src(jsSources)
    .pipe(concat('script.js'))
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(browserify())
    .pipe(gulpif(env === 'production', uglify()))
    .pipe(gulp.dest(outputDir + 'js'))
    .pipe(connect.reload());
});

gulp.task('sass', function () {
  return gulp.src(sassSources)
    .pipe(scsslint())
    .pipe(sass({
      includePaths: neat.includePaths
    }))
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(outputDir + 'css'))
    .pipe(csslint())
    .pipe(csslint.reporter())
    .pipe(connect.reload());
});

gulp.task('html', function() {
  gulp.src('builds/development/*.html')
    .pipe(gulpif(env === 'production', minifyHTML()))
    .pipe(gulpif(env === 'production', gulp.dest(outputDir)))
    .pipe(connect.reload());
});

gulp.task('json', function() {
  gulp.src(jsonSources)
    .pipe(gulpif(env === 'production', jsonminify()))
    .pipe(gulpif(env === 'production', gulp.dest('builds/production/js')))
    .pipe(connect.reload());
});

gulp.task('watch', function() {
  gulp.watch(jsSources, ['js']);
  gulp.watch('components/sass/*.scss', ['sass']);
  gulp.watch('builds/development/*.html', ['html']);
  gulp.watch(jsonSources, ['json']);
});

gulp.task('connect', function() {
  connect.server({
    root: outputDir,
    livereload: true
  })
});

// gulp.task('default', function () {
//   return gulp.src(SRC)
//     .pipe(changed(DEST))
//     // ngAnnotate will only get the files that 
//     // changed since the last time it was run 
//     .pipe(ngAnnotate())
//     .pipe(gulp.dest(DEST));
// });

gulp.task('default', ['html', 'json', 'js', 'sass', 'connect', 'watch']);

