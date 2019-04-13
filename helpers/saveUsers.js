const SaveToJson = require('./SaveToJson');

const saveUsers = users => {
    SaveToJson('/storage/users.json', users);
}

module.exports = saveUsers