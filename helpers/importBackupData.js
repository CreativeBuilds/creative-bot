const fs = require('fs');
const fstream = require('fstream');
const path = require('path');
const unzip = require('unzip');

const importBackupData = (source, dir) => {
    var readStream = fs.createReadStream(source);
    var writeStream = fstream.Writer(dir);
        
    readStream
        .pipe(unzip.Parse())
        .pipe(writeStream)
        
}

module.exports = importBackupData;