// https://12factor.net/

/*
node build/src/cli.js -p 8080 -t bla.txt
npm run cli -- -p 8080 -t bla.txt
*/

console.log(process.argv);
/*
[
  '/Users/mikebild/.nvm/versions/node/v18.17.1/bin/node',
  '/Users/mikebild/Projects/introduction-nodejs/EXAMPLES/GEOSN/ASS/build/src/cli.js',
  '-p',
  '8080',
  '-t',
  'bla.txt'
]
*/

/*
export PORT=8080 (windows)
PORT=8080 node build/src/cli.js
*/
console.log(process.env.PORT);

const { port, fileName } = getVars();
console.log(`Variables - Port: ${port} - Filename: ${fileName}`);

function getVars() {
  const [_, __, ___, paramPort, fileNameParam, fileName] = process.argv;
  const envPort = process.env.PORT;
  const usedPort = envPort || paramPort || "8181";
  return {
    port: usedPort,
    fileName,
  };
}
