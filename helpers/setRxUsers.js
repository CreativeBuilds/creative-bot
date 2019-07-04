const { BehaviorSubject } = require('rxjs');

let setRxUsers = new BehaviorSubject({});

module.exports = setRxUsers;
