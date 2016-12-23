var express = require('express');
var router = express.Router();

var path = require('path');
var mime = require('mime');
var fs = require('fs');
var convertController = require('../controllers/ConversionController.js');
var convertService = require('../services/convertCsvToJson');

router.get('/', function(req, res, next) {
    res.render('index');
});

/** 
csv to json conversion. 
**/
router.get('/convertcsvtojson', function(req, res, next) {
    convertController.convertCsvToJson(req.query.q, function(err, response) {
        var file = response.result;
        if(response.response_code == 1 ){
            res.download(file); // Set disposition and send it.
        } else {
            res.status(404).send(response.msg);
        }
  
    });
});

module.exports = router;
