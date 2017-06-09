const fs = require('fs');

function load({path}) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if(err) {
        reject(err);
        return;
      }
      resolve({fileContent: data.toString()});
    });
  });
}

(async () => {
  try {
    const {fileContent} = await load({path: '1234.txt'});
    const gg = await load({path: '123.txt'});

    console.log(fileContent);
  } catch(error) {
    console.error(error);
  }
})();