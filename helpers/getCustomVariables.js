const fs = require('fs');
const { join } = require('path');
module.exports = () => {
  return new Promise(res => {
    const custom_variables = {};
    console.log('DIR', __dirname, join(__dirname, '../custom_variables'));
    fs.readdir(join(__dirname, '../custom_variables'), (err, files) => {
      console.log('FIles', files);
      if (err) {
        console.error('Could not list the directory.', err);
        process.exit(1);
      }

      files.forEach(file => {
        console.log('GETTING FILE', file);
        let extensionName = file.substring(file.length - 3);
        if (extensionName === '.js') {
          let command = require(`../custom_variables/${file}`);
          custom_variables[command.name] = command;
        }
      });
      return res(custom_variables);
    });
  });
};
