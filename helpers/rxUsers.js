const { BehaviorSubject } = require('rxjs');

let rxUsers = new BehaviorSubject({});

module.exports = rxUsers;
