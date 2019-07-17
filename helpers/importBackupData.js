const fs = require('fs');
const fstream = require('fstream');
const path = require('path');

const importBackupData = (source, dir) => {
  var readStream = fs.createReadStream(source);
  var writeStream = fstream.Writer(dir);
};

module.exports = importBackupData;
