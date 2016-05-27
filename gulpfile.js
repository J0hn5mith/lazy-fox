//https://www.sitepoint.com/simple-gulpy-workflow-sass/
var gulp = require('gulp');
var sass = require('gulp-sass');
var webpack = require('webpack-stream');

var input = './frontend/css/**/*.scss';
var output = './static/css';

var input_js = 'frontend/js/main.js';
var input_folder_js = 'frontend/js/*';
var output_js = 'static/js/';

function swallowError(error) {

	// If you want details of the error in the console
	console.log(error.toString())

	this.emit('end')
}

gulp.task('sass', function() {
	return gulp
		// Find all `.scss` files from the `stylesheets/` folder
		.src(input)
		// Run Sass on those files
		.pipe(sass())
		.on('error', swallowError)
		// Write the resulting CSS in the output folder
		.pipe(gulp.dest(output));
});

gulp.task('webpack', function() {
	return gulp.src(input_js)
		.pipe(webpack({
			output: {
				filename: "main.js"
			}
		}))
		.on('error', swallowError)
		.pipe(gulp.dest(output_js));
});

gulp.task('watch', function() {
	gulp.watch(input_folder_js, ['webpack'])
		.on('change', function(event) {
			console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
		});
	gulp.watch(input, ['sass'])
		.on('change', function(event) {
			console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
		});
});
