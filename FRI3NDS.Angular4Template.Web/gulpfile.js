const gulp = require('gulp');
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const debug = require('gulp-debug');
const gulpIf = require('gulp-if');
const del = require('del');
const newer = require('gulp-newer');
const sass = require('gulp-sass');
const tslint = require('gulp-tslint');
var merge = require('merge-stream');
var rename = require('gulp-rename');
var tildeImporter = require('node-sass-tilde-importer');

var tsProject = ts.createProject('tsconfig.json');
var isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

var paths = {
	src: {
		root: "./Assets",
		scripts: "./Assets/Scripts",
		js: "./Assets/Scripts/app",
		lib: "./node_modules",
		bootstrap: "./node_modules/bootstrap",
		globalStyles: "./Assets/Styles",
		sassBase: "./Assets/Styles/base",
		defaultStyles: "./Assets/Styles/default",
		images: "./Assets/Images",
		localization: "./Assets/Localization",
	},
	dest: {
		root: "./wwwroot",
		scripts: "./wwwroot/Scripts",
		js: "./wwwroot/Scripts/app",
		lib: "./wwwroot/Scripts/lib",
		globalStyles: "./wwwroot/Styles",
		images: "./wwwroot/Images",
		localization: "./wwwroot/Localization",
	}
};

// Линт скриптов
gulp.task('tslint', function () {
	return gulp.src(paths.src.js + "/**/*.ts")
		.pipe(gulpIf(isDevelopment, debug({ title: 'lint ts file:' })))
		.pipe(tslint())
		.pipe(tslint.report());
});

// Билд
gulp.task('ts:compile:copy', function () {
	return tsProject.src(paths.src.js + "/**/*.ts", { since: gulp.lastRun('ts:compile:copy') })
		//.pipe(newer({ dest: paths.dest.js, ext: '.js' }))
		.pipe(gulpIf(isDevelopment, debug({ title: 'ts from assets' })))
		.pipe(sourcemaps.init())
		.pipe(tsProject()).js
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(paths.dest.js));
});
gulp.task('lib:copy', function () {
	return gulp.src([
		paths.src.lib + '/core-js/client/shim.min.js',
		paths.src.lib + '/systemjs/dist/system.src.js',
		paths.src.lib + '/rxjs/**',
		paths.src.lib + '/zone.js/dist/**',
		paths.src.lib + '/@angular/**',
		paths.src.lib + '/angular2-jwt/**',
		paths.src.lib + '/ng2-validation/bundles/ng2-validation.umd.js',
		paths.src.lib + '/libphonenumber-js/bundle/libphonenumber-js.min.js',
		paths.src.lib + '/hammerjs/hammer.min.js',
		paths.src.lib + '/angular4-notifications/**',
		paths.src.lib + '/@ngx-translate/core/bundles/core.umd.js',
		paths.src.lib + '/@ngx-translate/http-loader/bundles/http-loader.umd.js',
		paths.src.lib + '/tslib/tslib.js',
		paths.src.lib + '/moment/moment.js',
		paths.src.lib + '/primeng/**',
		paths.src.lib + '/font-awesome/css/font-awesome.min.css',
		paths.src.lib + '/font-awesome/fonts/**',
	], { since: gulp.lastRun('lib:copy'), base: paths.src.lib })
		.pipe(newer(paths.dest.lib))
		.pipe(gulp.dest(paths.dest.lib));
});
gulp.task('bootstrap:compile:copy', function () {
	return gulp
		.src(paths.src.globalStyles + '/vendors/bootstrap-customized.scss')
		.pipe(gulpIf(isDevelopment, debug({ title: 'bootstrap from bootstrap' })))
		.pipe(sass({
			outputStyle: 'nested',
			precison: 3,
			errLogToConsole: true,
			includePaths: [
				paths.src.sassBase,
				paths.src.lib + '/bootstrap/scss',
				paths.src.lib + '/bootstrap/utilities',
				paths.src.lib + '/bootstrap/mixins'
			]
		}))
		.pipe(rename('bootstrap.css'))
		.pipe(gulp.dest(paths.dest.globalStyles));
});
gulp.task('images:copy', function () {
	return gulp.src(paths.src.images + '/**/*.*', { since: gulp.lastRun('images:copy') })
		.pipe(newer(paths.dest.images))
		.pipe(gulpIf(isDevelopment, debug({ title: 'images from assets' })))
		.pipe(gulp.dest(paths.dest.images));
});
gulp.task('views:copy', function () {
	return gulp.src(paths.src.js + '/**/*.html', { since: gulp.lastRun('views:copy') })
		.pipe(newer(paths.dest.js))
		.pipe(gulpIf(isDevelopment, debug({ title: 'views from assets' })))
		.pipe(gulp.dest(paths.dest.js));
});
gulp.task('styles:copy', function () {
	return gulp
		.src(paths.src.js + '/**/*.scss', { since: gulp.lastRun('styles:copy') })
		.pipe(newer(paths.dest.js))
		.pipe(gulpIf(isDevelopment, debug({ title: 'stylesheets compilation' })))
		.pipe(sass({
			outputStyle: 'nested',
			precison: 3,
			errLogToConsole: true,
			includePaths: [
				paths.src.sassBase
			]
		}))
		.pipe(gulp.dest(paths.dest.js));
});
gulp.task('defaultStyles:copy', function () {
	return gulp
		.src(paths.src.defaultStyles + '/default.scss')
		.pipe(gulpIf(isDevelopment, debug({ title: 'default stylesheets compilation' })))
		.pipe(sass({
			outputStyle: 'nested',
			precison: 3,
			errLogToConsole: true,
			includePaths: [
				paths.src.sassBase,
				paths.src.defaultStyles
			]
		}))
		.pipe(gulp.dest(paths.dest.globalStyles));
});
gulp.task('settings:copy', function () {
	var task1 = gulp.src(paths.src.root + '/*.{html,config.js}', { since: gulp.lastRun('settings:copy') })
		.pipe(newer(paths.dest.root))
		.pipe(gulpIf(isDevelopment, debug({ title: 'settings from assets' })))
		.pipe(gulp.dest(paths.dest.root));
	var task2 = gulp.src(paths.src.localization + '/*.json', { since: gulp.lastRun('settings:copy') })
		.pipe(newer(paths.dest.localization))
		.pipe(gulpIf(isDevelopment, debug({ title: 'localization from assets' })))
		.pipe(gulp.dest(paths.dest.localization));
	return merge(task1, task2);
});

// Очистка
gulp.task('js:clean', function () {
	return del(paths.dest.js);
});
gulp.task('lib:clean', function () {
	return del(paths.dest.lib);
});
gulp.task('styles:clean', function () {
	return del(paths.dest.js + '/*.css');
});
gulp.task('images:clean', function () {
	return del(paths.dest.images);
});
gulp.task('settings:clean', function () {
	return del(paths.dest.root + '/*.{html,config.js}');
});
gulp.task('assets:clean', gulp.parallel('js:clean', 'styles:clean', 'images:clean', 'settings:clean'));

// Почистить и построить все, кроме библиотек
gulp.task('assets:build',
	gulp.series(
		gulp.parallel('js:clean', 'styles:clean', 'images:clean', 'settings:clean'),
		gulp.parallel('ts:compile:copy', 'bootstrap:compile:copy', 'images:copy', 'styles:copy', 'defaultStyles:copy', 'views:copy', 'settings:copy')
	)
);
// Почистить и построить библиотеки
gulp.task('assets:lib:build', gulp.series('lib:clean', 'lib:copy'));

// Следить за всеми изменениями, кроме библиотек
gulp.task('assets:watch', function () {
	gulp.watch(paths.src.js + "/**/*.ts", gulp.series('ts:compile:copy'));
	gulp.watch(paths.src.js + "/**/*.html", gulp.series('views:copy'));
	gulp.watch(paths.src.js + '/**/*.scss', gulp.series('styles:copy'));
	gulp.watch(paths.src.defaultStyles + '/**/*.scss', gulp.series('defaultStyles:copy'));
	gulp.watch(paths.src.images + '/**/*.*', gulp.series('images:copy'));
	gulp.watch(paths.src.globalStyles + '/bootstrap-customized.scss', gulp.series('bootstrap:compile:copy'));
	gulp.watch(paths.src.sassBase + '/**/*.scss', gulp.parallel('styles:copy', 'bootstrap:compile:copy'));
	gulp.watch(paths.src.root + '/*.{html,config.js}', gulp.series('settings:copy'));
	gulp.watch(paths.src.localization + '/*.json', gulp.series('settings:copy'));
});

// Почистить и построить все, кроме библиотек + следить за всеми изменениями, кроме библиотек
gulp.task('__dev', gulp.series('assets:build', 'assets:watch'));