const {BehaviorSubject} = require('rxjs');
const users = require('../storage/users.json');

// This creates a new B.S. which allows us to listen to this node and make changes whenever and whereever we want
const rxUsers = new BehaviorSubject(users);

module.exports = rxUsers;
