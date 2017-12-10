'use strict';
var azure = require('azure-storage');
var imageMapper = require('../lib/imageMapper');
const uuidv1 = require('uuid/v1');

var IMAGES_TABLE = 'images';
var IMAGES_PARTITION_KEY = 'images';

var tableSvc = azure.createTableService();

tableSvc.createTableIfNotExists('images', function (error, result, response) {
    if (!error) {
        // Table exists or created
    }
});

module.exports = {

    list: function (callback) {
        var query = new azure.TableQuery();

        tableSvc.queryEntities(IMAGES_TABLE, query, null, function(error, result, response) {
            var res = [];
            for(var i = 0; i < result.entries.length; i++) {
                var mappedImage = imageMapper.mapToImage(result.entries[i]);
                res.push(mappedImage); 
            } 
            callback(res);
        });
    },

    get: function (id, callback) {
        tableSvc.retrieveEntity(IMAGES_TABLE, IMAGES_PARTITION_KEY, id, function(error, result, response) {
            console.log(error);
            var img = imageMapper.mapToImage(result);
            callback(img);
        });
    },

    save: function(imageId, fileName, description, submitter) {
        console.log("Saving entity with RowKey: " + imageId);
        var ent = imageMapper.mapToAzureEntity({
            Id : imageId,
            FileName : fileName,
            Description : description,
            Submitter : submitter
        },
        IMAGES_PARTITION_KEY);
        tableSvc.insertEntity(IMAGES_TABLE, ent, function() { });
    }
};