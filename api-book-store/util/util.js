const date = require('date-and-time'); date.locale('th');  // Thai
const path = require('path');
const fs = require('fs-extra');
const multer = require('multer');
const Storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./res/images");
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + "_" + file.originalname);
    }
});
const upload = multer({ storage: Storage }).array("imgUploader", 1); //Field name and max count

exports.upload_center = function(req,res,callback){
    upload(req, res, function (err) {
        if (err) { 
            callback({status: false,data: []})
        }
       
        callback({status: true,data: {body: req.body, file: req.files}});
    });
}

exports.isEmpty = function(object) {
    return Object.keys(object).length === 0
}