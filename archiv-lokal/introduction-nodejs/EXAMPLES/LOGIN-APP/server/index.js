const { start } = require('./server');

start({ port: 8080 }).then(instance => {
  console.log(`Listen on ${instance.address().port}`);
});
