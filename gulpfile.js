var gulp = require('gulp');
var concat = require('gulp-concat');
var watch = require('gulp-watch');

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
		'./public/js/service/header.js',
		'./public/js/controller/core.js',
		'./public/js/controller/home.js',
		'./public/js/controller/improve.js',
		'./public/js/controller/studysheets.js',
		'./public/js/controller/glossary.js',
		'./public/js/controller/cardHeader.js',
		'./public/js/controller/cards.js'
	]

	var allJS = ['./public/js/*.js'];

	return gulp.src(jsFiles)
		.pipe(concat('bundle.js'))
		.pipe(gulp.dest('./public/bundles/'));
});

gulp.task('pack-css', function () {
	return gulp.src(['./public/css/*.css'])
		.pipe(concat('stylesheet.css'))
		.pipe(gulp.dest('./public/bundles'));
});

gulp.task('default', ['pack-js', 'pack-css']);
