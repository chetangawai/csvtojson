
'use strict';

var cb = require('./../utils/callback');
var convertService = require('../services/convertCsvToJson.js');

exports.convertCsvToJson = function(filename,next){
	convertService.convertCsvToJson(filename,function(err,data){
		next(err,data);
	});
};
