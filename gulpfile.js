/* jshint esversion: 6 */

'use strict';

/* package */
var gulp = require('gulp');
var through = require('through2');

/* gulp */
var sass = require('gulp-dart-sass');
var glob = require('gulp-sass-glob');
var rename = require('gulp-rename');
var prefix = require('gulp-autoprefixer');
var map = require('gulp-sourcemaps');

/* sync */
var sync = require('browser-sync').create();

/* logging */
var log = require('log');
require('log-node')();

/* watch */
var watch = {
	html: ['**/*.html', '**/*.php',],
	scss: ['./**/src/scss/**/*.scss',],
};

/* error */
var error = (file, line, column, message) => {
	log.error(`[${line}:${column}] ${file} →  ${message}`);
};

/* task : scss */
gulp.task('scss', gulp.parallel(done => {
	gulp.src(watch.scss, { base: '.', })
		.pipe(map.init())
		.pipe(glob())
		.pipe(sass({
			outputStyle: 'compressed',
		}).on('error', err => {
			error(err.relativePath, err.line, err.column, err.messageOriginal);

			done();
		}))
		.pipe(prefix({
			cascade: false,
		}))
		.pipe(through.obj((file, encoding, callback) => {
			if (!file.relative.includes('site')) return callback(null, file);
			var hex2p3 = value => {
				var value = value.replace('#', '');
				if (value.length === 3) value = value.split('').map(a => { return a.repeat(2); }).join('');
				var bigint = parseInt(value, 16);
				var rgb = [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255,];
				var p3 = [(rgb[0] / 255).toFixed(2), (rgb[1] / 255).toFixed(2), (rgb[2] / 255).toFixed(2),].join(' ');
				return p3;
			};
			var data = file.contents.toString(encoding);
			var match = new Set(data.match(/([a-z-]+):([^:]*\#[^}:]+)(?=;|})/gmi));
			match.forEach(style => {
				var hex = style.match(/\#([a-f0-9]{3,6})/gim);
				var p3 = hex.map(value => { return hex2p3(value); });
				var before = style;
				var after = style;
				for (let a = 0; a < hex.length; a++) after = after.replace(hex[a], `color(display-p3 ${p3[a]})`);
				var regex = new RegExp(`(?<={|;)${style.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g');
				data = data.replace(regex, `${before};${after}`);
			});
			file.contents = new Buffer.from(data, encoding);
			callback(null, file);
		}))
		.pipe(map.write('.'))
		.pipe(rename(path => {
			path.dirname += '/../css';
		}))
		.pipe(gulp.dest(file => {
			return file.base;
		}))
		.pipe(sync.stream());

	done();
}));

/* task : watch */
gulp.task('watch', gulp.parallel(done => {
	sync.init({ logLevel: 'silent', notify: false, });

	gulp.watch(watch.html).on('change', sync.reload);
	gulp.watch(watch.scss).on('change', gulp.parallel(['scss',]));

	done();
}));

/* task : default */
gulp.task('default', gulp.parallel(['watch', 'scss',], done => {
	log.notice('Listening for changes...');

	done();
}));
