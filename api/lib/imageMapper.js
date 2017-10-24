'use strict';
var azure = require('azure-storage');
var entGen = azure.TableUtilities.entityGenerator;

module.exports = {
    mapToImage: function (azureEntity) {
        return {
            Id: azureEntity.RowKey._,
            
            FileName: azureEntity.FileName._,
            Description: azureEntity.Description._,
            Submitter: azureEntity.Submitter._,
        };
    },

    mapToAzureEntity: function(image, partitionKey) {
        return {
            PartitionKey: entGen.String(partitionKey),
            RowKey: entGen.String(image.Id),

            FileName : entGen.String(image.FileName),
            Description: entGen.String(image.Description),
            Submitter: entGen.String(image.Submitter)
        };
    }
}