const fs = require('fs');

class Database {

  constructor(pathToDump) {
    this.restoreDump = this.restoreDump.bind(this);
    this.dump = this.dump.bind(this);
    this.dumpPath = pathToDump;
    this.rows = {};
    this.restoreDump();
  }

  async restoreDump() {
    fs.promises
      .readFile(this.dumpPath)
      .then((file) => {
          try {
            file = JSON.parse(file);
            for (let id in file) {
              this.rows[id] = file[id];
            }
          } catch (e) {
            return;
          }
        }
      )
      .catch(console.warn);
  }

  async dump() {
    fs.promises
      .writeFile(this.dumpPath, JSON.stringify(this.rows))
      .catch(console.warn);
  }

  add(row) {
    this.rows[row.id] = row;
    this.dump();
  }

  get(id) {
    return this.rows[id] || null;
  }

  del(id) {
    if (!this.rows[id]) {
      return false;
    }
    delete this.rows[id];
    this.dump();
    return;
  }

  all() {
    return Object.values(this.rows);
  }
}

module.exports = Database;
