'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

gulp.task('clean', function () {
    return gulp.src(['dist/'], { read: false })
        .pipe($.clean());
});

gulp.task('default', ['clean'], function () {
    gulp.src(["src/**/*.scss"])
      .pipe($.order([
        "_variables.scss",
        "functions/_number.scss",
        "functions/_string.scss",
        "functions/_list.scss",
        "functions/_map.scss",
        "functions/_mvs.scss",
        "mixins/_mvs.scss"
      ]))
      .pipe($.concat("mvsass.scss"))
      .pipe(gulp.dest("dist/"));

    gulp.src(["src/ruby/*.rb"])
      .pipe(gulp.dest("dist/"));
});