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
    sourcemaps = require('gulp-sourcemaps'),
    jsonminify = require('gulp-jsonminify'),
    concat = require('gulp-concat'),
    autoprefixer = require('gulp-autoprefixer'),
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

const babel = require('gulp-babel');

var env = process.env.NODE_ENV || 'development';

if (env === 'development') {
    outputDir = 'builds/development/';
    sassStyle = 'expanded';
} else {
    outputDir = 'builds/production/';
    sassStyle = 'compact';
}

jsSources = ['components/scripts/**/*.js'];
sassSources = ['components/sass/**/*.scss'];
htmlSources = [outputDir + '*.html'];
jsonSources = ['builds/development/js/*.json'];

gulp.task('js', function() {
    return gulp.src(jsSources)
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(changed(outputDir + 'js'))
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(concat('script.js'))
        .pipe(browserify())
        .pipe(gulpif(env === 'production', uglify()))
        .pipe(gulp.dest(outputDir + 'js'))
        .pipe(connect.reload());
});

gulp.task('sass', function() {
    return gulp.src(sassSources)
        .pipe(scsslint())
        //changed needs to know the output dir to know what files changed
        .pipe(changed(outputDir + 'css'))
        .pipe(sass({
            includePaths: neat.includePaths
        }))
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(sourcemaps.init())
        .pipe(cssnano())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(outputDir + 'css'))
        .pipe(connect.reload());
});

gulp.task('html', function() {
    return gulp.src('builds/development/*.html')
        .pipe(gulpif(env === 'production', minifyHTML()))
        .pipe(gulpif(env === 'production', gulp.dest(outputDir)))
        .pipe(connect.reload());
});

gulp.task('json', function() {
    return gulp.src(jsonSources)
        .pipe(gulpif(env === 'production', jsonminify()))
        .pipe(gulpif(env === 'production', gulp.dest('builds/production/js')))
        .pipe(connect.reload());
});

//Set up liveReload
gulp.task('connect', function() {
    connect.server({
        root: outputDir,
        livereload: true
    })
});

/* WATCH TASKS */

gulp.task('watch.js', function() {
    gulp.watch(jsSources, ['js']);
});
gulp.task('watch.scss', function() {
    gulp.watch('components/sass/*.scss', ['sass']);
});
gulp.task('watch.html', function() {
    gulp.watch('builds/development/*.html', ['html']);
})
gulp.task('watch.json', function() {
    gulp.watch(jsonSources, ['json']);
})

gulp.task('watch', ['watch.js', 'watch.scss', 'watch.html', 'watch.json']);

/* END WATCH TASKS */

gulp.task('default', ['html', 'json', 'js', 'sass', 'connect', 'watch']);