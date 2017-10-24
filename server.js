var express = require('express'),
app = express(),
port = process.env.PORT || 3000,
bodyParser = require('body-parser'); 

if (process.env.NODE_ENV == 'local') {
    console.log("Running locally");
    require('dotenv').load();
}

app.use("/static", express.static("css"));
app.use("/static", express.static("images"));
app.use("/static", express.static("templates"));

var galleryRoutes = require('./api/routes/galleryRoutes'); //importing route
galleryRoutes(app); //register the route

var imageRoutes = require('./api/routes/imageRoutes'); //importing route
imageRoutes(app); //register the route

app.listen(port);

console.log('todo list RESTful API server started on: ' + port);