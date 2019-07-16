const fs = require('fs');
const archiver = require('archiver');

const exportBackupData = (source, dir, name) => {
  var output = fs.createWriteStream(dir + '/' + name + '.zip');
  var archive = archiver('zip', { zlib: { level: 9 } });

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
};

module.exports = exportBackupData;
