const fs = require('fs');
const path = require('path');
const unzip = require('unzip');

const importBackupData = (source, dir) => {
    fs.createReadStream(source)
        .pipe(unzip.Extract({ path: dir }))
}

module.exports = importBackupData;