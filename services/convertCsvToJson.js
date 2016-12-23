'use strict';
var path = require('path');
var mime = require('mime');
var fs = require('fs');
var request = require('request');

exports.convertCsvToJson = function convertCsvToJson(fileParam, next) {
        var file = decodeURI(fileParam);
        var filePath = file.split("/");
        var filelength = filePath.length;
        var filename = filePath[filelength - 1];
        var filenameWithoutExtension = filename.split('.');
        try {
            // get remote file        
            request.get(file, function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    var Converter = require("csvtojson").Converter;
                    var converter = new Converter({});
                    //convert data from remote file to json
                    converter.fromString(body, function(err, result) {
                        if (err) {
                            console.log("Csv to json conversion error");
                            console.log(err);
                            next(null,{
                                 success: false,
                                 result: err,
                                 response_code:2,
                                 msg: 'There was error while converting csv file to json'
                            });
                        }
                        else {
                            var jsonfile = require('jsonfile');
                            var jsonFilePath = __dirname.split("services");
                            var jsonFilename = filenameWithoutExtension[0] + '.json';
                            var jsonFileCompletePath = jsonFilePath[0] + '/public/jsonFiles/';
                            var file1 = path.join(jsonFileCompletePath, jsonFilename);
                            //create empty file
                            fs.openSync(file1, 'w');
                            // write json response to file
                            jsonfile.writeFile(file1, result, {spaces: 2},function(errJson) {
                                if(errJson) {
                                    console.log("Json write error")
                                    console.error(errJson)    
                                    next(null,{
                                       success: false,
                                       result: errJson,
                                       response_code:3,
                                       msg: 'There was error while json to file'
                                    });
                                } else {
                                    
                                    
                                    
                                   // result.pipe(file1);
                                   console.log("File converted successfully");
                                   next(null, {
                                      success: true,
                                      response_code:1,
                                      //result:filename,
                                      result:file1,
                                      msg: 'Csv file converted successfully to json'
                                   });
                                }
                                
                            })
                            
                            
                        }
                    });

                }
                else {
                    //next(error,null)
                    console.log("File could not be fetched");
                    console.log(error)
                    next(null,{
                        success: false,
                        result: error,
                        response_code:4,
                        msg: 'File could not be fetched'
                    });
                }
            });
        }
        catch (exception) {
            console.log('exception');
            console.log(exception)
            next(null,{
                        success: false,
                        result: exception,
                        response_code:5,
                        msg: 'There was some exception'
                    });
        }

    } //function