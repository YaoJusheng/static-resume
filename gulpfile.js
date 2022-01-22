var gulp        = require('gulp');
var sass        = require('gulp-sass');
var prefix      = require('gulp-autoprefixer');
var minifyCSS   = require('gulp-minify-css');
var rename      = require('gulp-rename');
var browserSync = require('browser-sync').create();
var htmlmin     = require('gulp-htmlmin');
var htmlclean   = require('gulp-htmlclean');
var babel       = require('gulp-babel');
var uglify      = require('gulp-uglify');
var imagemin    = require('gulp-imagemin');


// Static server
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: './public/'
        }
    });
});

// 压缩html
gulp.task('minify-html', function() {
  return gulp.src('./*.html')
      .pipe(htmlclean())
      .pipe(htmlmin({
          removeComments: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
      }))
      .pipe(gulp.dest('./public'));
  done();
});

// Build css files
gulp.task('compressCSS', function() {
  return gulp.src(['src/css/*.scss','src/css/*.css'])
        .pipe(sass())
        .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(minifyCSS())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./public/src/css/'))
        .pipe(browserSync.stream());
  done();
});

// 压缩 js
gulp.task('minify-js', function (done) {
  return gulp.src(['src/js/*.js'])
      .pipe(uglify())
      .pipe(gulp.dest('./public/src/js/'));
  done();
});

// 压缩图片
gulp.task('minify-images', function() {
    return gulp.src('*.ico', 'src/img/*.*')
        .pipe(imagemin(
        [imagemin.gifsicle({'optimizationLevel': 3}),
        imagemin.optipng({'optimizationLevel': 7}),
        imagemin.svgo()],
        {'verbose': true}))
        .pipe(gulp.dest('./public/src/images'))
});


gulp.task('cname', function (done) {
  return gulp.src(['./CNAME'])
      .pipe(uglify())
      .pipe(gulp.dest('./public/'));
  done();
});

gulp.task('font', function (done) {
  return gulp.src(['./font/*'])
      .pipe(gulp.dest('./public/font'));
  done();
});

// Watch files for changes & recompile
gulp.task('watch', function () {
  gulp.watch('src/css/*.scss', gulp.series('compressCSS'));
  // gulp.watch('lib/js/*.js', gulp.series('scripts'));
  // gulp.watch('img/*', gulp.series('images'));
  // return gulp.watch(['src/css/*.scss'], ['compressCSS']);
});

// Default task, running just `gulp` will move font, compress js and scss, start server, watch files.
// gulp.task('default', ['compressCSS', 'browser-sync', 'watch']);

gulp.task('default',gulp.series(gulp.parallel('compressCSS','minify-js', 'minify-images', 'font', 'watch', 'cname', 'minify-html', 'browser-sync')), function () {
  console.log("----------gulp Finished----------");
  // Do something after a, b, and c are finished.
});