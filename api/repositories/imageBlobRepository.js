'use strict';
var azure = require('azure-storage');
const uuidv1 = require('uuid/v1');

var CONNECTION_STRING = "XXX";

var blobSvc = azure.createBlobService(CONNECTION_STRING);

function BlobRepository(containerName) {

    this._containerName = containerName;
    
    blobSvc.createContainerIfNotExists(this._containerName, function(error, result, response){
        if(!error){
          // Container exists and is private
        }
    });
}

BlobRepository.prototype.get = function(blobName, outStream) {
    var me = this;
    console.log("Getting blob: " + blobName);
    blobSvc.getBlobProperties(
        me._containerName,
        blobName,
        function(err, properties, status) {
            if(!err) {
                outStream.header('Content-Type', properties.contentSettings.contentType);
                blobSvc.createReadStream(me._containerName, blobName).pipe(outStream);
            } else {
                outStream.send(404, "The file %s does not exist", blobName);
            }
        });
}

BlobRepository.prototype.save = function(img_path, mimeType, callback) {
    var blobName = uuidv1();
    console.log("Saving blob with name: " + blobName);
    blobSvc.createBlockBlobFromLocalFile(this._containerName, blobName, img_path,{ contentSettings: { contentType: mimeType } }, function() { callback(blobName)} );
}

module.exports = BlobRepository; 