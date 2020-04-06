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

// Static server
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: './'
        }
    });
});


// Build css files
gulp.task('compressCSS', function() {
  return gulp.src(['src/css/*.scss','./lib/*.css'])
        .pipe(sass())
        .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(minifyCSS())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./public/css/'))
        .pipe(browserSync.stream());
  done();
});

// ??js??
gulp.task('minify-js', function (done) {
  return gulp.src(['./lib/*.js'])
      // .pipe(babel({
      //     //?ES6?????????JS??
      //     presets: ['es2015'] // es5????
      // }))
      .pipe(uglify())
      .pipe(gulp.dest('./public/js/'));
  done();
});

gulp.task('cname', function (done) {
  return gulp.src(['./CNAME'])
      .pipe(uglify())
      .pipe(gulp.dest('./public/'));
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

gulp.task('default',gulp.series(gulp.parallel('compressCSS','minify-js', 'browser-sync', 'watch', 'cname', 'minify-html')), function () {
  console.log("----------gulp Finished----------");
  // Do something after a, b, and c are finished.
});