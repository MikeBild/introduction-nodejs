const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  const fileStream = fs.createReadStream('demo.json');
  // fileStream.on('data', data => console.log(data.toString()));
  fileStream.pipe(res);
});
const instance = server.listen(8080, () => console.log(`Listen on ${instance.address().port}`));

  // fs.readFile('demo.json', (err, data) => {

    // if(err) {
    //   res.statusCode = 500;
    //   res.write(JSON.stringify({message: err.message}));
    // }

    // res.end(data || '');
  // });
