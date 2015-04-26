'use strict';

var gulp = require('gulp'),
	$    = require('gulp-load-plugins')();

gulp.task('clean', function () {
	gulp.src('examples/**/css', { read: false })
		.pipe($.clean());

	return gulp.src(['dist/'], { read: false })
		.pipe($.clean());
});





gulp.task('compileLib', ['clean'], function () {
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

gulp.task('cleanLib', function () {
	return gulp.src('dist/', { read: false })
		.pipe($.clean());
});

gulp.task('compileExample', function () {
	gulp.src('examples/base/sass/**/*.scss')
		.pipe($.compass({
			time        : true,
			comments    : false,
			style       : 'nested',
			import_path : 'examples/_core/sass',
			// config_file : 'examples/base/config.rb'
			css         : 'examples/base/css',
			sass        : 'examples/base/sass',
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
		.pipe(gulp.dest('examples/base/css'))
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
		.pipe(gulp.dest('examples/base/css'));
});

gulp.task('watchExample', function () {
	return gulp.watch('examples/base/sass/**/*.scss', ['compileExample']);
});

gulp.task('cleanExample', function () {
	return gulp.src('examples/**/css', { read: false })
		.pipe($.clean());
});

gulp.task('hostExample', function() {
	gulp.src('examples')
		.pipe($.webserver({
			// livereload: true,
			directoryListing: true,
			open: "html/index.html"
		}));
});

gulp.task('default', [ 'cleanLib', 'compileLib' ]);
gulp.task('example', [ 'cleanExample', 'compileExample', 'watchExample', 'hostExample' ]);
