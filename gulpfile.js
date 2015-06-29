var gulp = require('gulp');
var concat = require('gulp-concat');
var cssmin = require('gulp-cssmin');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');
var plumber = require('gulp-plumber');
var autoprefixer = require('gulp-autoprefixer');
var imagemin = require('gulp-imagemin');
var webserver = require('gulp-webserver');
var gutil = require('gulp-util'); //реліз
var fs = require('fs'); // файлова система
var htmlmin = require('gulp-htmlmin');
var less = require('gulp-less');

gulp.task('default', ['cssConcat', 'jsUglify', 'imageMin', 'minify', 'watch', 'webserver']);

gulp.task('minify', function() {
  return gulp.src('./**/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('build'))
});

gulp.task('release', function(){
	var number = gutil.env.number;
	if (!number) return;
	if(fs.existsSync('./releases/'+number)) {
		return console.error('Number '+ number + 'already exists');
	}
	console.log('Making release' + number + '');
	gulp.src("./build/**/*.*")
	.pipe(gulp.dest("./releases" + number + "/"));
});
gulp.task('webserver', function(){
	gulp.src('./')
	.pipe(webserver({
		livereload: true,
		directoryListing: true,
		open: true
	}));
});

gulp.task('imageMin', function(){
	gulp.src('./app/img/**/*.*')
	.pipe(imagemin())
	.pipe(gulp.dest('./build/img'));
});

gulp.task('watch', function(){
	gulp.watch('./app/css/**/*.css', ['cssConcat']);
	gulp.watch('./app/js/**/*.js', ['jsUglify']);
});

gulp.task('jsUglify', function(){
	gulp.src('./app/js/**/*.js')
	.pipe(uglify())
	.pipe(concat('all.js'))
	.pipe(gulp.dest('./build/js')); 
});

gulp.task('cssConcat', function(){
	gulp.src('./app/css/**/*.css')
	.pipe(plumber())
	.pipe(autoprefixer())
	.pipe(cssmin())
	.pipe(concat('all.css'))
	.pipe(gulp.dest('./build/css'));
});

gulp.task('less', function () {
  return gulp.src('./app/less/**/*.less')
    .pipe(less())
    .pipe(concat('style.css'))
    .pipe(gulp.dest('./app/css'));
});
