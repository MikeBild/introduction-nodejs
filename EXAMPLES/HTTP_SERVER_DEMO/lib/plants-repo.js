const plants = {};

module.exports = {
  all: () => Promise.resolve(Object.keys(plants).map(x => plants[x])),
  byName: name => Promise.resolve(plants.find(x => x.name === name)),
  insert: name => Promise.resolve((plants[name] = { name, biostatus: 0 })),
  update: plant => Promise.resolve((plants[name] = plant)),
  update: name => {
    delete plants[name];
    return Promise.resolve();
  }
};
