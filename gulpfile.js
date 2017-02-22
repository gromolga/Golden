var gulp = require('gulp'),
    scss = require('gulp-sass');
    browserSync = require('browser-sync'),
    concat      = require('gulp-concat'),
    uglify      = require('gulp-uglifyjs'),
    cssnano     = require('gulp-cssnano'),
    rename      = require('gulp-rename'),
    del         = require('del'),
    imagemin    = require('gulp-imagemin'),
    pngquant    = require('imagemin-pngquant'),
    cache       = require('gulp-cache'),
    spritesmith       = require('gulp.spritesmith'),
    autoprefixer = require('gulp-autoprefixer');

gulp.task('scss', function(){
	return gulp.src('app/scss/**/*.scss')
	.pipe(scss())
	.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) 
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.reload({stream: true}))
});

gulp.task('browser-sync',function() {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false
	});
});

gulp.task('scripts', function() {
	return gulp.src([
		'app/libs/jquery/dist/jquery.min.js',])
		.pipe(concat('libs.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('app/js'));
});		

gulp.task('watch', ['browser-sync', 'scss', 'scripts'], function() {
	gulp.watch('app/scss/**/*.scss', ['scss']);
	gulp.watch('app/*.html', browserSync.reload);
	gulp.watch('app/js/**/*.js', browserSync.reload);
});

gulp.task('clean', function() {
	return del.sync('dist');
});

gulp.task('img', function() {
	return gulp.src('app/img/**/*')
	.pipe(cache(imagemin({
		interlaced: true,
		progressive: true,
		svgoPlugins: [{removeViewBox: false}],
		use: [pngquant()]
	})))
	.pipe(gulp.dest('dist/img'));
});

gulp.task('build', ['sass', 'scripts'], function() {

	var buildCss = gulp.src([
		'app/css/main.css',
		'app/css/libs.min.css'
		])
	.pipe(gulp.dest('dist/css'))

	var buildFonts = gulp.src('app/fonts/**/*')
	.pipe(gulp.dest('dist/fonts'))

	var buildJs = gulp.src('app/js/**/*')
	.pipe(gulp.dest('dist/js'));
});

gulp.task('default', ['watch']);

gulp.task('sprite', function() {
	var spriteData = 
		gulp.src('./app/img/sprite-img/*.*')
		 	.pipe(spritesmith({
		 		imgPath: '../img/sprite.png',
		 		imgName: 'sprite.png',
		 		cssName: '_sprite.scss',
		 		cssFormat: 'scss',
		 	}));
	spriteData.img.pipe(gulp.dest('./app/img/'));	 	
	spriteData.css.pipe(gulp.dest('./app/scss/imports'));
});