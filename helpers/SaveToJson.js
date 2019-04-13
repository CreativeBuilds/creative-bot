const fs = require('fs');
var path = require('path');
var appDir = path.dirname(require.main.filename);

const SaveToJson = (pathFromRoot, fileToSave, cb) => {
    if(typeof fileToSave !== "string") {
        if(typeof fileToSave !== "object") {
            return console.error("Tried saving to JSON and file wasnt a string or JSON")
        }
        fileToSave = JSON.stringify(fileToSave);
    }
    fs.writeFile(path.join(appDir, pathFromRoot), fileToSave, (err) => {
        if(err) return console.error("Error while trying to save to JSON", err);
        if(cb) cb();
    })
};


module.exports = SaveToJson;