const isGt10 = x => x > 10 ? Promise.resolve() : Promise.reject();

isGt10(7)
  .then(_ => true)
  .catch(_ => false)
  .then(console.log)

isGt10(100)
  .then(_ => true)
  .catch(_ => false)
  .then(console.log)
