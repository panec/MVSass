'use strict';

var gulp = require('gulp'),
	$ = require('gulp-load-plugins')({
		pattern: ['*']
	});

// MVSass library compile ----------------------------------
gulp.task('compileLib', function () {
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
		.pipe($.size({
			title: 'Combined mvsass.scss'
		}));
});

gulp.task('cleanLib', function (cb) {
	$.del('dist/', cb);
});

gulp.task('default', function (cb) {
	$.runSequence('cleanLib', 'compileLib', cb);
});

// Example project compile ----------------------------------
gulp.task('compileExampleBase', function () {
	return gulp.src('examples/base/sass/**/*.scss')
		.pipe($.sass({
			includePaths: ['./examples/_core/sass', './examples/base/sass/'],
			outputStyle: 'nested',
			sourceComments: false
		}).on('error', $.sass.logError))
		.pipe(gulp.dest('examples/base/css'))
		.pipe($.duration('Base compile time'));
});

gulp.task('compileExampleTheme', function () {
	return gulp.src('examples/theme/sass/**/*.scss')
		.pipe($.sass({
			includePaths: ['./examples/_core/sass', './examples/theme/sass/'],
			outputStyle: 'nested',
			sourceComments: false
		}).on('error', $.sass.logError))
		.pipe(gulp.dest('examples/theme/css'))
		.pipe($.duration('Theme compile time'));
});

gulp.task('optimizeExample', function () {
	return gulp.src(['examples/**/*.css', '!examples/html/**/*.css', '!examples/**/*-opt.css', '!examples/**/*-opt-beauty.css'])
		.pipe($.size({
			title: 'Example css before optimization'
		}))
		.pipe($.rename({
			suffix: "-opt"
		}))
		// .pipe($.combineMediaQueries());
		.pipe($.csso())
		.pipe($.duration('Optimization time'))
		.pipe($.size({
			title: 'Example css after optimization'
		}))
		.pipe(gulp.dest('examples'))
		.pipe($.rename({
			suffix: "-beauty"
		}))
		.pipe($.jsbeautifier({
			logSuccess: false,
			indentChar: "	",
			indentSize: 1
		}))
		.pipe($.duration('Beautifing time'))
		.pipe($.size({
			title: 'Example css after beautifing'
		}))
		.pipe(gulp.dest('examples'));
});

gulp.task('compileExample', function (cb) {
	$.runSequence('compileExampleBase', 'compileExampleTheme', 'optimizeExample', cb);
});

gulp.task('cleanExample', function (cb) {
	$.del('examples/**/css', cb);
});

gulp.task('watchExample', function () {
	// $.livereload.listen();
	gulp.watch(['examples/**/*.css', '!examples/**/*-opt.css', '!examples/**/*-opt-beauty.css'], function (e) {
		$.runSequence('compileExample');
	});
});

gulp.task('hostExample', function () {
	return gulp.src('examples')
		.pipe($.webserver({
			// livereload: true,
			directoryListing: true,
			open: "html/index.html"
		}));
});
