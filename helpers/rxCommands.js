const { BehaviorSubject } = require('rxjs');
 
const { filter } = require('rxjs/operators');
const _ = require('lodash');

let rxCommands = new BehaviorSubject({});

module.exports = rxCommands;
