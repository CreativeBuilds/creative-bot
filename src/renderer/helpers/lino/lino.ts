import { LINO, UTILS } from 'lino-js';
/**
 * @description hook into the lino js library
 */
export const lino = new LINO({
  nodeUrl: 'https://fullnode.lino.network/',
  chainId: 'lino-testnet-upgrade1'
});
export const linoUtils = UTILS;
