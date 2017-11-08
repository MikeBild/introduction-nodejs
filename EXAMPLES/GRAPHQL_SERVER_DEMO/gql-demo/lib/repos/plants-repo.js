const plants = {};

module.exports = {
  all,
  allByGenoTypeName,
  byName,
  insert,
  update,
  delete: remove,
  remove
};

function all() {
  return Promise.resolve(Object.keys(plants).map(x => plants[x]));
}

function allByGenoTypeName(genoTypeName) {
  return Promise.resolve(
    Object.keys(plants)
      .map(x => plants[x])
      .filter(x => x.genoTypeName == genoTypeName)
  );
}

function byName(name) {
  return new Promise((resolve, reject) => {
    if (!plants[name]) return reject(new Error("not found"));
    resolve(plants[name]);
  });
}

function insert(plant) {
  return new Promise((resolve, reject) => {
    Promise.resolve(plants[plant.name]).then(data => {
      if (data) return reject(new Error("name already exist"));
      resolve((plants[plant.name] = plant));
    });
  });
}

function update(plant) {
  return Promise.resolve((plants[name] = plant));
}

function remove(name) {
  delete plants[name];
  return Promise.resolve();
}
