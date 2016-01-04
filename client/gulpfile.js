
(function(){

    var gulp = require('gulp');
    var debug = require('gulp-debug');
    //var coffee = require('gulp-coffee');
    var concat = require('gulp-concat');
    var uglify = require('gulp-uglify');
    var minifyCss = require('gulp-minify-css');
    var sourcemaps = require('gulp-sourcemaps');
    var htmlmin = require('gulp-htmlmin');
    var del = require('del');

    var target = 'public';

    var paths = {
        scripts1: [
            'bower_components/jquery/dist/jquery.js',
            'bower_components/mustache.js/mustache.js',
            'bower_components/remarkable-bootstrap-notify/dist/bootstrap-notify.js',
            'bower_components/screenfull/dist/screenfull.js',
            'src/js/*.js'
        ],
        scripts2: [
            'bower_components/jquery/dist/jquery.js',
            'src/futurepress/**/*.js',
            '!src/futurepress/*min.js'
        ],
        css1: [
            'src/js/kview.css',
            'src/main.css'
        ],
        css2: [
            'src/futurepress/css/normalize.css',
            'src/futurepress/css/main.css',
            'src/futurepress/css/popup.css'
        ],
        images: [
            'src/futurepress/img/*.gif',
            'src/img/*.*'
        ],
        html: [
            'src/*.html'
        ],
        bootstrap: [
            'bower_components/bootstrap/dist/**/*.*',
            'src/3p/bootstrap-cyborg.min.css',
            '!bower_components/bootstrap/dist/**/*.css',
            '!bower_components/bootstrap/dist/**/*.map'
        ]
    };

    gulp.task('clean', function(cb) {
        //del([target], cb);
        cb();
    });


    gulp.task('css1', function() {
        return gulp.src(paths.css1)
            .pipe(sourcemaps.init())
            .pipe(concat('all1.min.css'))
            .pipe(minifyCss())
            .pipe(sourcemaps.write())
            .pipe(gulp.dest(target + '/css'));
    });

    gulp.task('css2', function() {
        return gulp.src(paths.css2)
            .pipe(sourcemaps.init())
            .pipe(concat('all2.min.css'))
            .pipe(minifyCss())
            .pipe(sourcemaps.write())
            .pipe(gulp.dest(target + '/css'));
    });


    gulp.task('scripts1', [], function() {
        // Minify and copy all JavaScript (except vendor scripts)
        // with sourcemaps all the way down
        return gulp.src(paths.scripts1)
            .pipe(debug({title: '<- :'}))
            .pipe(sourcemaps.init())
            //.pipe(coffee())
            .pipe(uglify())
            .pipe(concat('all1.min.js'))
            .pipe(sourcemaps.write())
            .pipe(debug({title: '-> :'}))
            .pipe(gulp.dest(target + '/js'));
    });

    gulp.task('scripts2', [], function() {
        // Minify and copy all JavaScript (except vendor scripts)
        // with sourcemaps all the way down
        return gulp.src(paths.scripts2)
            .pipe(debug({title: '<- :'}))
            .pipe(sourcemaps.init())
            //.pipe(coffee())
            .pipe(uglify())
            .pipe(concat('all2.min.js'))
            .pipe(sourcemaps.write())
            .pipe(debug({title: '-> :'}))
            .pipe(gulp.dest(target + '/js'));
    });

    // Copy all static images
    gulp.task('images', [], function() {
        return gulp.src(paths.images)
            .pipe(gulp.dest(target + '/img'));
    });

    // Copy all static images
    gulp.task('bootstrap', [], function() {
        return gulp.src(paths.bootstrap)
            .pipe(gulp.dest(target + '/bootstrap-3.3.6'));
    });

    // Copy all static images
    gulp.task('html', [], function() {
        return gulp.src(paths.html)
            .pipe(htmlmin({collapseWhitespace: true}))
            .pipe(gulp.dest(target));
    });


    // Rerun the task when a file changes
    gulp.task('watch', function() {
        gulp.watch(paths.scripts1, ['scripts1']);
        gulp.watch(paths.scripts2, ['scripts2']);
        gulp.watch(paths.css1, ['css1']);
        gulp.watch(paths.css2, ['css2']);
        //gulp.watch(paths.images, ['images']);
        gulp.watch(paths.html, ['html']);
    });

    // The default task (called when you run `gulp` from cli)
    gulp.task('default', ['clean', 'watch', 'scripts1', 'scripts2', 'css1', 'css2', 'images', 'bootstrap', 'html']);

})();