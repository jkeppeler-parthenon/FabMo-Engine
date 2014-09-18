var fs = require('fs');
var machine = require('./machine').machine;
var db = require('./db');
var File=db.File;

// These are the only file extensions that are allowed for upload.
// File extension filtering is not case sensitive
ALLOWED_EXTENSIONS = ['.nc','.g','.sbp','.gc','.gcode'];

// Handler for 'quit' which stops the machine's motion and aborts the file
exports.quit = function(req, res, next) {
    machine.quit();
    res.json(200,{'success':true});
};

// Handler for 'pause' which stops the machine's motion, but can generally be resumed
exports.pause = function(req, res, next) {
    machine.pause();
    res.json(200,{'success':true});
};

// Resume from pause
exports.resume = function(req, res, next) {
    machine.resume();
    res.json(200,{'success':true});
};

// Handler for running a file (given by file id)
exports.run = function(req, res, next) {
	File.get_by_id(req.params.id,function(file){
		if(!file){res.send(404);return;}
		file.saverun();//update last run and run count information
		machine.runFile(file.path);
		res.send(302);
	});
};