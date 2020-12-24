/*
  This file is intended to be overwritten. It provides a common place to store
  site configuration data.
*/

const config = {
  title: 'Wallet Demo',
  titleShort: 'Demo',
  balanceText: 'BCH Balance',
  balanceIcon: 'fab-bitcoin',

  // The BCH address used in a memo.cash account. Used for tracking the IPFS
  // hash of the mirror of this site.
  memoAddr: 'bitcoincash:qqt55pmh0645xyr9gae3a58xvn7xfz32xc5y0tpngl',

  // Footer Information
  hostText: 'Permissionless Software Foundation',
  hostUrl: 'https://PSFoundation.cash/',
  sourceCode: 'https://github.com/Permissionless-Software-Foundation/tor-list-frontend',
  torUrl: 'n4ghc2qqmq4wkj4wxfhdjzym2d7oe2qxjb3hygeilneikd6vgtqt4vyd.onion',
  clearWebUrl: 'https://TorList.cash'
}

module.exports = config
