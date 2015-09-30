'use strict';

var gulp = require('gulp'),
	$    = require('gulp-load-plugins')({ pattern: ['*'] });

// $.notify.logLevel(2);

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
		.pipe($.size({ title: 'Combined mvsass.scss' }));

	gulp.src(["src/ruby/*.rb"])
		.pipe(gulp.dest("dist/"))
		.pipe($.size());
});

gulp.task('cleanLib', function (cb) {
	$.del('dist/', cb);
});



gulp.task('compileExampleBase', function () {
	return gulp.src('examples/base/sass/**/*.scss')
		.pipe($.compass({
			force       : true,
			debug       : false,
			time        : true,
			comments    : false,
			style       : 'nested',
			import_path : 'examples/_core/sass',
			css         : 'examples/base/css',
			sass        : 'examples/base/sass',
			require     : './src/ruby/parentsSelector.rb'
			// config_file : 'examples/base/config.rb'
		}))
		.pipe($.duration('Base compile time'));
});

gulp.task('compileExampleBase:node', function () {
	return gulp.src('examples/base/sass/**/*.scss')
		.pipe($.rename({
			suffix: "-node"
		}))
		.pipe($.sass({
			includePaths   : [ './examples/_core/sass', './examples/base/sass/' ],
			outputStyle    : 'nested',
			sourceComments: false
		}).on('error', $.sass.logError))
		.pipe(gulp.dest('examples/base/css'))
		.pipe($.duration('Base compile time'));
});

gulp.task('compileExampleTheme', function () {
	return gulp.src('examples/theme/sass/**/*.scss')
		.pipe($.compass({
			force       : true,
			debug       : false,
			time        : true,
			comments    : false,
			style       : 'nested',
			import_path : 'examples/_core/sass',
			css         : 'examples/theme/css',
			sass        : 'examples/theme/sass',
			require     : './src/ruby/parentsSelector.rb'
			// config_file : 'examples/theme/config.rb'
		}))
		.pipe($.duration('Theme compile time'));
});

gulp.task('compileExampleTheme:node', function () {
	return gulp.src('examples/theme/sass/**/*.scss')
		.pipe($.rename({
			suffix: "-node"
		}))
		.pipe($.sass({
			includePaths   : [ './examples/_core/sass', './examples/theme/sass/' ],
			outputStyle    : 'nested',
			sourceComments: false
		}).on('error', $.sass.logError))
		.pipe(gulp.dest('examples/theme/css'))
		.pipe($.duration('Theme compile time'));
});

gulp.task('optimizeExample', function () {
	return gulp.src([ 'examples/**/*.css', '!examples/**/*-opt.css', '!examples/**/*-opt-beauty.css' ])
		.pipe($.size({ title: 'Example css before optimization' }))
		.pipe($.rename({
			suffix: "-opt"
		}))
		.pipe($.combineMediaQueries())
		// .pipe($.csso())
		.pipe($.duration('Optimization time'))
		.pipe($.size({ title: 'Example css after optimization' }))
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
		.pipe($.size({ title: 'Example css after beautifing' }))
		.pipe(gulp.dest('examples'));
});

gulp.task('cleanExample', function () {
	$.del( 'examples/**/css', cb);
});



//------------

gulp.task('watch', function() {
	// $.livereload.listen();

	gulp.src('examples/base/sass/**/*.scss')
		.pipe($.plumber())
		.pipe($.compass({
			watch          : true,
			debug          : false,
			time           : true,
			comments       : false,
			quiet          : false,
			force          : false,
			sourcemap      : false,
			task           : 'watch',
			style          : 'nested',
			import_path    : ['examples/_core/sass'],
			// config_file :'examples/base/config-gulp.rb',
			sass           :'examples/base/sass/',
			css            :'examples/base/css/',
			// image       :'examples/base/img/',
			// font        :'examples/base/fonts/',
			require        : './src/ruby/parentsSelector.rb'
		}));

	return gulp.src( [ 'examples/base/css/**/*.css', '!examples/base/css/**/*-opt.css', '!examples/base/css/**/*-opt-beauty.css' ] )
		.pipe($.watch( [ 'examples/base/css/**/*.css', '!examples/base/css/**/*-opt.css', '!examples/base/css/**/*-opt-beauty.css' ], { verbose: true } ) )
		.pipe($.plumber())
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
		.pipe(gulp.dest('examples/base/css'))
		.pipe($.notify({
			title: "Optimized",
			message: "<%= file.relative %>"
		}));

	// return gulp.watch('examples/base/css/**/*.css', function(event) {
	// 	console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
	// });

	// return gulp.watch( 'examples/base/css/**/*.css' )
	// // 	.pipe( $.watch( 'examples/base/css/**/*.css', { verbose: true } ) )
	// 	.pipe( gulp.dest( 'examples/base/123' ) );

	// return gulp.src( 'examples/base/css/**/*.css' )
	// 	.pipe( $.watch( 'examples/base/css/**/*.css', { verbose: true } ) )
	// 	.pipe( gulp.dest( 'examples/base/123' ) );

	// return $.watch('examples/base/css/**/*.css', { verbose: true }, function( vinyl ) {
	// 	// console.log( vinyl.pipe() );
	// 	return vinyl
	// 		.pipe($.debug())
	// 		.pipe(gulp.dest('examples/base/123'));

		// 	.pipe($.plumber())
		// 	.pipe($.size({ title: 'Example css before optimization' }))
		// 	.pipe($.rename({
		// 		suffix: "-opt"
		// 	}))
		// 	.pipe($.combineMediaQueries())
		// 	.pipe($.csso())
		// 	.pipe($.duration('Optimization time'))
		// 	.pipe($.size({ title: 'Example css after optimization' }))
		// 	.pipe(gulp.dest('examples/base/css'))
		// 	.pipe($.rename({
		// 		suffix: "-beauty"
		// 	}))
		// 	.pipe($.jsbeautifier({
		// 		logSuccess: false,
		// 		indentChar: "	",
		// 		indentSize: 1
		// 	}))
		// 	.pipe($.duration('Beautifing time'))
		// 	.pipe($.size({ title: 'Example css after beautifing' }))
		// 	.pipe(gulp.dest('examples/base/css'));
	// });

	// 	// .pipe($.watch())
	// 	.pipe($.size({ title: 'Example css before optimization' }))
	// 	.pipe($.rename({
	// 		suffix: "-opt"
	// 	}))
	// 	.pipe($.combineMediaQueries())
	// 	.pipe($.csso())
	// 	.pipe($.duration('Optimization time'))
	// 	.pipe($.size({ title: 'Example css after optimization' }))
	// 	.pipe(gulp.dest('examples/base/css'))
	// 	.pipe($.rename({
	// 		suffix: "-beauty"
	// 	}))
	// 	.pipe($.jsbeautifier({
	// 		logSuccess: false,
	// 		indentChar: "	",
	// 		indentSize: 1
	// 	}))
	// 	.pipe($.duration('Beautifing time'))
	// 	.pipe($.size({ title: 'Example css after beautifing' }))
	// 	.pipe(gulp.dest('examples/base/css'));

	// return $.watch({
	// 	glob: themes[theme] + '/.css-cache/**/*.css'
	// }, function(files) {
	// 	return files.pipe($.plumber()).pipe($.combineMediaQueries()).pipe($.csso()).pipe(gulp.dest(themes[theme] + '/css/')).pipe($.livereload())
	// })
});

gulp.task('watchBaseExample', function () {
	return gulp.src('examples/base/sass/**/*.scss')
		.pipe($.compass({
			debug       : true,
			time        : true,
			comments    : false,
			task        : 'watch',
			style       : 'nested',
			import_path : 'examples/_core/sass',
			css         : 'examples/base/css',
			sass        : 'examples/base/sass',
			require     : './src/ruby/parentsSelector.rb'
			// config_file : 'examples/base/config.rb'
		}));
	});

gulp.task('watchThemeExample', function () {
	return gulp.src('examples/theme/sass/**/*.scss')
		.pipe($.compass({
			time        : true,
			comments    : false,
			task        : 'watch',
			style       : 'nested',
			import_path : 'examples/_core/sass',
			css         : 'examples/theme/css',
			sass        : 'examples/theme/sass',
			require     : './src/ruby/parentsSelector.rb'
			// config_file : 'examples/theme/config.rb'
		}));
	});

gulp.task('watchExample', function () {
	return gulp.src( [ 'examples/**/*.css', '!examples/**/*-opt.css', '!examples/**/*-opt-beauty.css'] )
		// .pipe($.watch())
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


gulp.task('hostExample', function() {
	return gulp.src('examples')
		.pipe($.webserver({
			// livereload: true,
			directoryListing: true,
			open: "html/index.html"
		}));
});



gulp.task( 'default', function( cb ) {
	$.runSequence( 'cleanLib', 'compileLib', cb );
});

gulp.task( 'compileExample', function( cb ) {
	$.runSequence( 'compileExampleBase', 'compileExampleTheme', 'optimizeExample', cb );
});

gulp.task( 'compileExample:node', function( cb ) {
	$.runSequence( 'compileExampleBase:node', 'compileExampleTheme:node', 'optimizeExample', cb );
});


gulp.task( 'watchExample:Base', function( cb ) {
	$.runSequence( 'compileExampleBase', 'compileExampleTheme', 'optimizeExample', cb );
});


// gulp.task( 'example', [ 'compileExampleBase', 'compileExampleTheme', 'compileExample' ] );
// gulp.task( 'watch', [ 'watchBaseExample', 'watchThemeExample', 'watchExample' ] );
// gulp.task( 'clean', [ 'cleanLib', 'cleanExample' ] );
