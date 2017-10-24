'use strict';

module.exports = function(app) {
  var controller = require('../controllers/galleryController');

  app.route('/images/:imageId')
    .get(controller.get_image);

  app.route('/thumbnails/:imageId')
    .get(controller.get_thumbnail);
}