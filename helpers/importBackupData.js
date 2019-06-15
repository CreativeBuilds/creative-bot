const fs = require('fs');
const path = require('path');
const unzip = require('unzip');

const importBackupData = (source, dir) => {

    fs.createReadStream(source)
    .pipe(unzip.Parse())
    .on('entry', function (entry) {
        var fileName = entry.path;
        var type = entry.type; // 'Directory' or 'File'
        var size = entry.size;
        entry.pipe(fs.createWriteStream(dir, {flags: 'w'}));

        entry.autodrain();
    });
}

module.exports = importBackupData;