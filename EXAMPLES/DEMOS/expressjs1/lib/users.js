const users = [];

module.exports = {
  getAll,
  insert
};

function getAll() {
  return users;
}

function insert(user) {
  users.push(user);
  return users;
}
