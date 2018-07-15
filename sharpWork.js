
var fs = require('fs');
var sharp = require('sharp');

var walkPath = './public/cards';

var walk = function (dir, done) {
	fs.readdir(dir, function (error, list) {
		if (error) {
			return done(error);
		}

		var i = 0;

		(function next () {
			var file = list[i++];

			if (!file) {
				return
				// return done(null);
			}

			var justFileName = file
			file = dir + '/' + file;

			fs.stat(file, function (error, stat) {

				if (stat && stat.isDirectory()) {
					walk(file, function (error) {
						next();
					});
				} else {
					// do stuff to file here
					console.log(file);
					sharp(file)
						.jpeg({
						quality: 60
						})
						.resize(420*2, 300*2)
						.max()
						.toFile('public/compressedjpg/'+justFileName.split('.')[0]+'.jpg', function(err) {

						});

						sharp(file)
							.resize(420*2, 300*2)
							.max()
							.webp({quality: 50})
							.toFile('public/compressedwebp/'+justFileName.split('.')[0]+'.webp', function(err) {

							});

					next();
				}
			});
		})();
	});
};
walk(walkPath)
