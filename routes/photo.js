var Photo = require('../models/Photo');
var path = require('path');
var fs = require('fs');
var join = path.join;
var photos = [];

photos.push({
    name: 'Node.js Logo',
    path: 'http://nodejs.org/images/logos/nodejs-green.png'
});

photos.push({
    name: 'Ryan Speaking',
    path: 'http://nodejs.org/images/ryan-speaker.jpg'
});

exports.list = function(req, res){
    res.render('photos', {title: 'Photos', photos: photos});
};

// render upload form
exports.form = function(req, res){
    res.render('photos/upload', {title: 'Photo upload'});
};

// submit the form
exports.submit = function(dir) {
    return function(req, res, next){
	var img = req.files.photo.image;
	var name = req.body.photo.name || img.name
	var path = join(dir, img.name);
	fs.rename(img.path, path, function(err){
	    if(err) return next(err);
	    // Insert the Photo record
	    Photo.create({
		name: name,
		path: img.name}, function(err){
		    if(err) return next(err);
		    res.redirect('/');
		});
	});
    };
};

// listing all the photos
exports.list = function(req, res, next){
    // Query all the Photo record
    Photo.find({}, function(err, photos){
	if(err) return next(err);
	res.render('photos', {title: 'Photos', photos: photos});
    });
};


// Download the form
exports.download = function(dir){
    return function(req, res, next){
	var id = req.params.id;
	// Query the Photo record with id
	Photo.findById(id, function(err, photo){
	    if(err) return next(err);
	    var path = join(dir, photo.path);
	    // Send the file to user
	    // res.sendfile(path);
	    // Or Downloadable file
	    res.download(path, photo.name + '.jpeg');
	});
    };
};
