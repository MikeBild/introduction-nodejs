const { v1 } = require('uuid');
const EventEmitter = require('events').EventEmitter;

module.exports = (initalAccountList = []) => {
  const accountList = [...initalAccountList];
  const pubsub = new EventEmitter();

  return {
    get,
    getNames,
    getNamesAsCSV,
    createAccount,
    del,
    add,
    onAdded,
    offAdded,
  };

  function createAccount(payload) {
    return {
      id: v1(),
      ...payload,
    };
  }

  function onAdded(callback) {
    pubsub.on('account::add', callback);
  }

  function offAdded(callback) {
    pubsub.off('account::add', callback);
  }

  function getNames() {
    return accountList.map(({ firstName = '', lastName = '' }) => `${firstName} ${lastName}`);
  }

  function getNamesAsCSV() {
    return accountList.reduce((state, { firstName = '', lastName = '' }) => {
      state += `${firstName} ${lastName},`;
      return state;
    }, '');
  }

  function get() {
    return accountList.filter(account => account);
  }

  function query(predicateFn = () => false) {
    return accountList.find(predicateFn);
  }

  function add(newAccount) {
    accountList.push(newAccount);
    pubsub.emit('account::add', newAccount);
  }

  function del(id) {
    const indexForDelete = accountList.findIndex(account => account.id === id);
    if (indexForDelete === -1) throw new Error(`Account ID ${id} not found`);
    delete accountList[indexForDelete];
  }
};
