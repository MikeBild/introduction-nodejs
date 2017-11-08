const plants = {};

module.exports = client => {
  return {
    all: limit => all(client, limit),
    byName,
    insert,
    update,
    delete: remove,
    remove
  };
};

function all(client, limit) {
  return client
    .then(conn =>
      conn.query("select * from m_plantmat_plant_materials limit ?;", [
        parseInt(limit)
      ])
    )
    .then(data =>
      data.map(x => ({
        id: x.id,
        name: x.mat_name,
        biostatus: x.fk_m_plantmat_bio_status
      }))
    )
    .then(data => ({
      data
    }));
  return Promise.resolve(Object.keys(plants).map(x => plants[x]));
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
