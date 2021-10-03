const {replaceBackground} = require("backrem");
const fs = require("fs");
const path = require("path");

class Controller {

  constructor(Database) {
    this.db = Database;
    this.postUpload = this.postUpload.bind(this);
    this.getList = this.getList.bind(this);
    this.getImage = this.getImage.bind(this);
    this.deleteImage = this.deleteImage.bind(this);
    this.getMerge = this.getMerge.bind(this);
  }

  async postUpload (req, res) {
    if (!req.file) {
      res.statusCode = 400;
      res.end('Invalid request');
    }
    req.file.id = req.file.filename;
    this.db.add(req.file);
    res.end(req.file.id);
  }

  async getList(req, res) {
    res.end(JSON.stringify(this.db.all()));
  }

  async getImage(req, res) {
    res.end(JSON.stringify(this.db.get(req.params.id)));
  }

  async deleteImage(req, res) {
    res.end(JSON.stringify(this.db.del(req.params.id)));
  }

  async getMerge(req, res) {
    if (!req.query.front || !req.query.back) {
      res.statusCode = 400;
      res.end('No required params');
    }
    let front = this.db.get(req.query.front);
    let back = this.db.get(req.query.back);
    if (!front || !back) {
      res.statusCode = 404;
      res.end('Images not found');
    }

    if (req.query.color) {
      if (!req.query.color.match(/\d{1,3},\d{1,3},\d{1,3}/g)) {
        delete req.query.color;
      }
    }

    if (req.query.threshold !== undefined) {
      req.query.threshold = parseInt(req.query.threshold, 10);
    }

    replaceBackground(
      fs.createReadStream(path.resolve(__dirname, '../', front.path)),
      fs.createReadStream(path.resolve(__dirname, '../', back.path)),
      JSON.parse('[' + req.query.color + ']'),
      req.query.threshold
    )
      .then(
        (readableStream) => {
          readableStream.on('end', () => {
            res.end();
          });
          readableStream.pipe(res);
        }
      )
      .catch((err) => {
        res.statusCode = 500;
        res.end('Server Error');
      });
  }

}

module.exports = Controller;
