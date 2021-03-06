var gulp = require('gulp');
var concat = require('gulp-concat');
var watch = require('gulp-watch');
const print = require('gulp-print').default;

gulp.task('stream', function () {
	console.log("Gulp is watching for changes and working when required.")
	return watch(['**/*.css',"**/*.js","**/*.html", "!**/node_modules/**", "!public/bundles/**"], { ignoreInitial: false },function (events){
		gulp.start("default")
	})
});

gulp.task('pack-js', function () {
	var jsFiles = [
		'./public/js/app.js',
		'./public/js/service/database.js',
		'./public/js/service/Account.js',
		'./public/js/service/header.js',
		'./public/js/controller/home.js',
		'./public/js/controller/core.js',
		'./public/js/controller/forgot.js',
		'./public/js/controller/reset.js',
		'./public/js/controller/improve.js',
		'./public/js/controller/studysheets.js',
		'./public/js/controller/glossary.js',
		'./public/js/controller/cards.js',
		'./public/js/controller/cardHeader.js',
		'./public/js/controller/outfacing.js'
	]

	var allJS = ['./public/js/*.js'];

	return gulp.src(jsFiles)
		.pipe(print())
		.pipe(concat('bundle.js'))
		.pipe(gulp.dest('./public/bundles/'));
});

gulp.task('pack-css', function () {
	return gulp.src(['./public/css/*.css',"!public/bundles/**"])
		.pipe(print())
		.pipe(concat({path:'stylesheet.css'}))
		.pipe(gulp.dest('./public/bundles'))
});

gulp.task('default', ['pack-js', 'pack-css']);
