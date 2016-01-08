var gulp = require('gulp'),
  gutil = require('gulp-util'),
  //jshint = require('gulp-jshint'),
  browserify = require('gulp-browserify'),
  sass = require('gulp-sass'),
  connect = require('gulp-connect'),
  gulpif = require('gulp-if'),
  uglify = require('gulp-uglify'),
  minifyHTML = require('gulp-htmlmin'),
  jsonminify = require('gulp-jsonminify'),
  concat = require('gulp-concat');

var bourbon = require('node-bourbon');
  bourbon.includePaths
var neat = require('node-neat');
  neat.includePaths // Array of Neat paths (including Bourbon)

  //gutil.log ("THIS IS MY BOURBON + NEAT: " + neat.includePaths);

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
  sassStyle = 'compressed';
}

jsSources = [
  
];
sassSources = ['components/sass/style.scss'];
htmlSources = [outputDir + '*.html'];
jsonSources = ['builds/development/js/*.json'];

gulp.task('js', function () {
  gulp.src(jsSources)
    .pipe(concat('script.js'))
    .pipe(browserify())
    .pipe(gulpif(env === 'production', uglify()))
    .pipe(gulp.dest(outputDir + 'js'))
    .pipe(connect.reload())
});

gulp.task('jshint', function() {
  return gulp.src('builds/development/js/*.js')
    .pipe(jshint());
    // .pipe(jshint.reporter('YOUR_REPORTER_HERE'));
});

gulp.task('sass', function () {
  gulp.src(sassSources)
    .pipe(sass({
      includePaths: neat.includePaths
    }))
    .pipe(sass({outputStyle: sassStyle}))
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(outputDir + 'css'))
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

gulp.task('default', ['html', 'json', 'js', 'sass', 'connect', 'watch']);