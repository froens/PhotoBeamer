'use strict';

var imgMetaRepo = require('../repositories/imageMetaRepository');
var BlobRepo = require('../repositories/imageBlobRepository');
var formidable = require('formidable');
var path = require('path');
var fs = require('fs');

var IMG_CONTAINER_NAME = "images";
var imgRepo = new BlobRepo(IMG_CONTAINER_NAME);

var THUMBNAIL_CONTAINER_NAME = "thumbnails";
var thumbnailRepo = new BlobRepo(THUMBNAIL_CONTAINER_NAME);

exports.get_image = function(req, res) {

  var imageId = req.params.imageId;

  imgMetaRepo.get(imageId, function(img) {
    res.set('Content-Type', 'image/jpeg');
    imgRepo.get(imageId, res);
  });
};

exports.get_thumbnail = function(req, res) {
  
    var imageId = req.params.imageId;
  
    imgMetaRepo.get(imageId, function(img) {
      res.set('Content-Type', 'image/jpeg');
      thumbnailRepo.get(imageId, res);
    });
  };

exports.list_image_meta = function(req, res) {
  imgMetaRepo.list(function(entries) {
    res.json(entries);
  });
};

exports.get_image_meta = function(req, res) {
  
  var imageId = req.params.imageId;

  imgMetaRepo.get(imageId, function(img) {
    res.json(img);
  });
};

exports.add_image = function(req, res) {
  console.log("Posted image");
  
  var form = new formidable.IncomingForm();

  form.multiples = true;
  
  // store all uploads in the /uploads directory
  form.uploadDir = "/tmp";

  // log any errors that occur
  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
  });

  // once all the files have been uploaded, send a response to the client
  form.on('end', function() {
    res.end('success');
  });

  // parse the incoming request containing the form data
  form.parse(req, function(err, fields, files) {
    
    var file = files['Data'];
    
    imgRepo.save(file.path, file.type, function(imageId) {
      var fileName = file.name;
      if(!fileName) {
        fileName = imageId;
      }
      var description = fields['Description'];
      var submitter = fields['Submitter'];
      
      imgMetaRepo.save(imageId, fileName, description, submitter);
    });
  });

  res.sendStatus(200);
};