const fs = require('fs');
const path = require('path');
const storage = require('electron-json-storage');
const archiver = require('archiver');

const backupData = (source, dir, name) => {
    var output = fs.createWriteStream(dir + '/' + name + '.zip');
    var archive = archiver('zip', { zlib: { level: 9 } });
  
    console.log(source);
  
    output.on('close', function() {
      console.log(archive.pointer() + ' total bytes');
      console.log('archiver has been finalized and the output file descriptor has closed.');
    });
  
    output.on('end', function() {
      console.log('Data has been drained');
    });
  
    archive.on('warning', function(err) {
      if (err.code === 'ENOENT') {
        // log warning
      } else {
        // throw error
        throw err;
      }
    });
  
    archive.on('error', function(err) {
      throw err;
    });
  
    archive.pipe(output);
    archive.directory(source + '/', false);
    archive.finalize();
  }

  module.exports = backupData;