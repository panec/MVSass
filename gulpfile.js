'use strict';

var gulp = require('gulp'),
	$    = require('gulp-load-plugins')();

gulp.task('clean', function () {
	return gulp.src(['dist/'], { read: false })
	.pipe($.clean());
});

gulp.task('styles', function () {
	gulp.src('examples/theme/css/**/*.css', { read: false })
	.pipe($.clean());

	gulp.src('examples/theme/sass/**/*.scss')
	.pipe($.compass({
		time        : true,
		comments    : false,
		style       : 'nested',
		config_file : 'examples/theme/config.rb',
		css         : 'examples/theme/css',
		sass        : 'examples/theme/sass',
		require     : './src/ruby/parentsSelector.rb'
	}))
	.pipe($.duration('Compile time'))
	.pipe($.size({ title: 'Example css before optimization' }))
	.pipe($.rename({
		suffix: "-opt"
	}))
	.pipe($.combineMediaQueries())
	.pipe($.csso())
	.pipe($.duration('Optimization time'))
	.pipe($.size({ title: 'Example css after optimization' }))
	.pipe(gulp.dest('examples/theme/css'))
	.pipe($.rename({
		suffix: "-beauty"
	}))
	.pipe($.jsbeautifier({
		logSuccess: false,
		indentChar: "	",
		indentSize: 1
	}))
	.pipe($.duration('Beautifing time'))
	.pipe($.size({ title: 'Example css after beautifing' }))
	.pipe(gulp.dest('examples/theme/css'));
});

gulp.task('default', ['clean'], function () {
	gulp.src(["src/**/*.scss", "!src/_mvs.scss"])
	.pipe($.order([
		"_variables.scss",
		"functions/_number.scss",
		"functions/_string.scss",
		"functions/_list.scss",
		"functions/_map.scss",
		"functions/_mvs.scss"
		]))
	.pipe($.concat("mvsass.scss"))
	.pipe(gulp.dest("dist/"))
	.pipe($.size({ title: 'Combined mvsass.scss' }));

	gulp.src(["src/ruby/*.rb"])
	.pipe(gulp.dest("dist/"))
	.pipe($.size());
});
