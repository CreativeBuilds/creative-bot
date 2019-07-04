const { BehaviorSubject } = require('rxjs');
 
const { filter } = require('rxjs/operators');
const _ = require('lodash');

let rxLists = new BehaviorSubject({});

module.exports = rxLists;
