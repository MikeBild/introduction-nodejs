const genotypes = {};

module.exports = {
  all,
  byName,
  insert,
  update,
  delete: remove,
  remove
};

function all() {
  return Promise.resolve(Object.keys(genotypes).map(x => genotypes[x]));
}

function byName(name) {
  return new Promise((resolve, reject) => {
    if (!genotypes[name]) return reject(new Error("not found"));
    resolve(genotypes[name]);
  });
}

function insert(genoType) {
  return new Promise((resolve, reject) => {
    Promise.resolve(genotypes[genoType.name]).then(data => {
      if (data) return reject(new Error("name already exist"));
      resolve((genotypes[genoType.name] = genoType));
    });
  });
}

function update(genoType) {
  return Promise.resolve((genotypes[name] = genoType));
}

function remove(name) {
  delete genotypes[name];
  return Promise.resolve();
}
