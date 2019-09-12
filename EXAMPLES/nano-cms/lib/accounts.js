const uuid = require('uuid');

module.exports = (initalAccountList = [], databaseConnection) => {
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
    return accountList;
  }

  function query(predicateFn = () => false) {
    return accountList.find(predicateFn);
  }

  function add(newAccount) {
    accountList.push(newAccount);
  }

  function del(id) {
    const indexForDelete = accountList.findIndex(account => account.id === id);
    delete accountList[indexForDelete];
  }
};
