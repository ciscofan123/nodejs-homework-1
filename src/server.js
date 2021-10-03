const path = require("path");
const express = require('express');
const Database = require("./Database");
const multer = require('multer');
const Controller = require("./Controller");
const config = require("./config");

const db = new Database(path.resolve(__dirname, '../', 'db_dump.json'));
const controller = new Controller(db);
const fileMiddleware = multer({dest: 'uploads/'});
const app = express();


//routes
app.post('/upload', fileMiddleware.single('file'), controller.postUpload);
app.get('/list', controller.getList);
app.get('/image/:id', controller.getImage);
app.delete('/image/:id', controller.deleteImage);
app.get('/merge', controller.getMerge);


app.listen(config.port, () => {
  console.log(`Server started on port ` + config.port);
});
