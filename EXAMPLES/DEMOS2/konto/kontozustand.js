const fs = require('fs');

module.exports = {
  load,
  save,
};

function load(accountNumber = 'newAccount.txt') {
  return new Promise((resolve, reject) => {
    fs.readFile(`${accountNumber}.txt`, (err, data) => {
      if(err) {
        reject(new Error(`Account number ${accountNumber} not found`));
        return;
      }
      resolve({balance: parseInt(data.toString('utf8')) || 0});
    });
  });
}

function save(accountNumber, amount) {
  return new Promise((resolve, reject) => {
    fs.writeFile(`${accountNumber}.txt`, amount, (err, data) => {
      if(err) {
        reject(err);
        return;
      }
      resolve({});
    });
  });
}