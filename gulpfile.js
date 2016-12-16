

var gulp = require('gulp'),
bower = require('gulp-bower'),
	gutil = require('gulp-util'),
	plumber = require('gulp-plumber'),
	imagemin = require('gulp-imagemin'),
    rtlcss = require('gulp-rtlcss'),
	concat = require('gulp-concat'),
	sass = require('gulp-sass'),
	autoprefixer  = require('autoprefixer'),
	gulpif = require('gulp-if'),
	rename = require('gulp-rename'),
	uglify = require('gulp-uglify'),
	autoprefixer = require('gulp-autoprefixer'),
	browserSync = require('browser-sync').create();
    





var env,
	outputDir,
	sassStyle,
	reload = browserSync.reload;

 env = process.env.NODE_ENV || 'development'; // Toggle development and production for the appropriate case.

 if (env=='development') {
 	outputDir = 'development/',
 	sassStyle = 'expanded'
 } else {
 	outputDir = 'production/',
 	sassStyle = 'compressed'
 }





 	var		 bootstrapPath ='./bower_components/bootstrap/scss';
    var 	fontawesomePath = './bower_components/font-awesome/scss';
    
    var 	config = {
        	sassPath: './scss',
       		bowerDir: './bower_components'
    };


    // create a task to do bower install [installs dependencies in the bower.json]
gulp.task('bower', function() {

    return bower()
        .pipe(gulp.dest(config.bowerDir))
});



// Copy fontawesome icons to public/fonts folder
gulp.task('icons', function() {
    return gulp.src(config.bowerDir + '/font-awesome/fonts/**.*')
        .pipe(gulp.dest(outputDir + 'fonts'));
});





// sass to css

gulp.task('sass', function(){


	return gulp.src(config.sassPath + '/style.scss')


	//concat( bootstrapPath , fontawesomePath )
          .pipe(sass({ 

          	includePaths : [bootstrapPath , fontawesomePath],
          	outputStyle : sassStyle

           }))

	    .pipe(autoprefixer({browsers:'last 2 versions'}))

		.pipe(gulp.dest('./')) // pointing to the THEME root for WORDPRESS

		.pipe(rtlcss())                     // Convert to RTL
	    .pipe(rename({ basename: 'rtl' }))  // Rename to rtl.css
	    .pipe(gulp.dest('./'));             // Output RTL stylesheets (rtl.css)
	        

         
});



//combining Javascript source to one js file 
var jsSource = [


 			config.bowerDir +  '/jquery/dist/jquery.js',
 			config.bowerDir + '/bootstrap/js/dist/util.js',
            config.bowerDir + '/bootstrap/js/dist/alert.js',
            config.bowerDir + '/bootstrap/js/dist/button.js',
            config.bowerDir + '/bootstrap/js/dist/carousel.js',
            config.bowerDir + '/bootstrap/js/dist/collapse.js',
            config.bowerDir +'/bootstrap/js/dist/dropdown.js',
            config.bowerDir + '/bootstrap/js/dist/modal.js',
            config.bowerDir +'/bootstrap/js/dist/tooltip.js',
            config.bowerDir +'/bootstrap/js/dist/popover.js',
            config.bowerDir + '/bootstrap/js/dist/scrollspy.js',
            config.bowerDir + '/bootstrap/js/dist/tab.js',


            // my custom javascripts here

            './scripts/_script.js'




];

gulp.task('js', function(){
	  gulp.src(jsSource)

    .pipe(concat('script.js'))
    .pipe(gulpif(env ==='production',rename({suffix: '.min'})))
	.pipe(gulpif(env ==='production',uglify()))
    .pipe(gulp.dest(outputDir + 'js'))
    
});




//imagemin for optimisation of images
gulp.task('images', function() {
  return gulp.src('./images/src/*')
    .pipe(imagemin({optimizationLevel: 7, progressive: true}))
    .pipe(gulp.dest('./images/dist'));
});

//watch *php, *scss, *js, *images

gulp.task('watch', function() {
 
  browserSync.init({
   		 files: ['./**/*.php'],
    	 proxy: 'http://localhost/gulp-test/development/', // to be changed base on the project
  });

  gulp.watch('scss/*.scss',['sass', reload]);
  gulp.watch(jsSource, ['js', reload]);
  gulp.watch('images/src/*', ['images']);
 
});


// default [gulp]
gulp.task('default',['sass', 'js','images', 'watch']);
