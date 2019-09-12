const uuid = require('uuid');

module.exports = (initalAccountList = []) => {
  const accountList = [...initalAccountList];

  return {
    get,
    createAccount,
    del,
    add,
  };

  function createAccount(payload) {
    return {
      id: uuid.v1(),
      ...payload,
    };
  }

  function get() {
    return accountList.filter(account => account);
  }

  function query(predicateFn = () => false) {
    return accountList.find(predicateFn);
  }

  function add(newAccount) {
    accountList.push(newAccount);
  }

  function del(id) {
    const indexForDelete = accountList.findIndex(account => account.id === id);
    if (indexForDelete === -1) throw new Error(`Account ID ${id} not found`);
    delete accountList[indexForDelete];
  }
};
