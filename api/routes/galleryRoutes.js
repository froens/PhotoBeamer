'use strict';

module.exports = function(app) {
  var controller = require('../controllers/galleryController');

  // todoList Routes
  app.route('/api/gallery')
    .get(controller.list_image_meta)
    .post(controller.add_image);

  app.route('/api/gallery/:imageId')
    .get(controller.get_image_meta);
};