const genotypes = {};

module.exports = client => ({
  all,
  byName,
  insert,
  update,
  delete: remove,
  remove
});

function all() {
  return Promise.resolve(Object.keys(genotypes).map(x => genotypes[x]));
}

function byName(name) {
  return new Promise((resolve, reject) => {
    if (!genotypes[name]) return reject(new Error("not found"));
    resolve(genotypes[name]);
  });
}

function insert(plant) {
  return new Promise((resolve, reject) => {
    Promise.resolve(genotypes[plant.name]).then(data => {
      if (data) return reject(new Error("name already exist"));
      resolve((genotypes[plant.name] = plant));
    });
  });
}

function update(plant) {
  return Promise.resolve((genotypes[name] = plant));
}

function remove(name) {
  delete genotypes[name];
  return Promise.resolve();
}
