module.exports = {
  handle,
};

function handle({ method }, response) {
  response.write('Hello World!');
  response.end();
}
