const { LINO, UTILS } = require('lino-js');

module.exports.lino = new LINO({
  nodeUrl: 'https://fullnode.lino.network/',
  chainId: 'lino-testnet-upgrade1'
});

module.exports.linoUtils = UTILS;
