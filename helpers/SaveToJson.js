const fs = require('fs');
var path = require('path');
var appDir = path.dirname(require.main.filename);
const storage = require('electron-json-storage');

const SaveToJson = (name, fileToSave, cb = function() {}) => {
  storage.set(name, fileToSave, function(err, something) {
    if (err) throw err;
  });
};

module.exports = SaveToJson;
