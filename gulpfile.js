

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
	pump = require('pump'),
	uglify = require('gulp-uglify'),
	postcss = require('gulp-postcss'),
	cssnano = require('cssnano'),
	postcss = require('gulp-postcss'),
	autoprefixer = require('gulp-autoprefixer'),
	browserSync = require('browser-sync').create();
    





// error handling
var onError = function (err) {
  console.log('An error occurred:', gutil.colors.magenta(err.message));
  gutil.beep();
  this.emit('end');
};


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





 var bootstrapPath ='./bower_components/bootstrap/scss';
    var fontawesomePath = './bower_components/font-awesome/scss';
    
    var config = {
        sassPath: './scss',
        bowerDir: './bower_components'
    }


    // create a task to do bower install
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
	.pipe(plumber({ errorHandler: onError }))  // error handling with plumber

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




// Copy bootstrapJS files to "outputDir + 'js'" folder

// gulp.task('bootstrap-js', function(){

// 	      return gulp.src([config.bowerDir + '/bootstrap/dist/js/bootstrap.min.js',
//             config.bowerDir + '/jquery/dist/jquery.min.js'
//         ])

//         .pipe(gulp.dest(outputDir + 'js'));
    
// });





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


            // my javascripts here

            './scripts/_script.js'




];

gulp.task('script-js', function(){
	  gulp.src(jsSource)
	// .pipe(plumber({ errorHandler: onError })) // error handling with plumber
    .pipe(concat('script.js'))
    .pipe(gulpif(env ==='production',rename({suffix: '.min'})))
	.pipe(gulpif(env ==='production',uglify()))
    .pipe(gulp.dest(outputDir + 'js'))
    
});




//imagemin
gulp.task('images', function() {
  return gulp.src('./images/src/*')
    .pipe(plumber({errorHandler: onError}))
    .pipe(imagemin({optimizationLevel: 7, progressive: true}))
    .pipe(gulp.dest('./images/dist'));
});

//watch *php, *scss, *js, *images

gulp.task('watch', function() {
 
  browserSync.init({
   		 files: ['./**/*.php'],
    	 proxy: 'http://localhost/gulp-test/development/',
  });

  gulp.watch('scss/*.scss',['sass', reload]);
  gulp.watch(jsSource, ['js', reload]);
  gulp.watch('images/src/*', ['images']);
 
});


// default [gulp]
gulp.task('default',['sass', 'js','watch', 'images']);












































// var gulp = require('gulp'),
// 	gutil = require('gulp-util'),
// 	plumber = require('gulp-plumber'),
// 	imagemin = require('gulp-imagemin'),
//     rtlcss = require('gulp-rtlcss'),
// 	concat = require('gulp-concat'),
// 	sass = require('gulp-sass'),
// 	autoprefixer  = require('gulp-autoprefixer'),
// 	gulpif = require('gulp-if'),
// 	rename = require('gulp-rename'),
// 	pump = require('pump'),
// 	uglify = require('gulp-uglify')
// 	browserSync = require('browser-sync').create();
    





// // error handling
// var onError = function (err) {
//   console.log('An error occurred:', gutil.colors.magenta(err.message));
//   gutil.beep();
//   this.emit('end');
// };


// var env,
// 	outputDir,
// 	sassStyle,
// 	reload = browserSync.reload;

//  env = process.env.NODE_ENV || 'development'; // Toggle development and production for the appropriate case.

//  if (env=='development') {
//  	outputDir = 'development/',
//  	sassStyle = 'expanded'
//  } else {
//  	outputDir = 'production/',
//  	sassStyle = 'compressed'
//  }





// // bootstrap-sass to css

// gulp.task('bootstrap-sass', function(){
// 	return gulp.src('scss/bootstrap.scss')
// 	// .pipe(plumber({ errorHandler: onError }))  // error handling with plumber
// 	.pipe(sass({outputStyle : sassStyle}).on('error', sass.logError))
// 	.pipe(gulpif(env ==='production',rename({suffix: '.min'}))) 
// 	.pipe(gulp.dest(outputDir + 'css'))
	
// });



// // style-sass to css
// gulp.task('style-sass', function(){
// 	return gulp.src('scss/style.scss')
// 	// .pipe(plumber({ errorHandler: onError }))  // error handling with plumber
// 	.pipe(sass({outputStyle : sassStyle}).on('error', sass.logError))
// 	.pipe(autoprefixer())
// 	.pipe(gulp.dest('./')) // pointing to the THEME root for WORDPRESS

// 	.pipe(rtlcss())                     // Convert to RTL
//     .pipe(rename({ basename: 'rtl' }))  // Rename to rtl.css
//     .pipe(gulp.dest('./'));             // Output RTL stylesheets (rtl.css)
	
// });




// // My Javascript

// var jsSource = ['js/src/_myScript.js'];

// gulp.task('js', function(){
// 	  gulp.src(jsSource)
// 	// .pipe(plumber({ errorHandler: onError })) // error handling with plumber
//     .pipe(concat('script.js'))
//     .pipe(gulpif(env ==='production',rename({suffix: '.min'})))
// 	.pipe(gulpif(env ==='production',uglify()))
//     .pipe(gulp.dest(outputDir + 'js'))
    
// });



// //imagemin
// gulp.task('images', function() {
//   return gulp.src('./images/src/*')
//     .pipe(plumber({errorHandler: onError}))
//     .pipe(imagemin({optimizationLevel: 7, progressive: true}))
//     .pipe(gulp.dest('./images/dist'));
// });

// //watch *php, *scss, *js, *images

// gulp.task('watch', function() {
 
//   browserSync.init({
//    		 files: ['./**/*.php'],
//     	 proxy: 'http://localhost/gulp-test/development/',
//   });

//   gulp.watch('scss/*.scss',['style-sass','bootstrap-sass' , reload]);
//   gulp.watch(jsSource, ['js', reload]);
//   gulp.watch('images/src/*', ['images']);
 
// });


// // default [gulp]
// gulp.task('default',['bootstrap-sass','style-sass', 'js','watch', 'images']);


