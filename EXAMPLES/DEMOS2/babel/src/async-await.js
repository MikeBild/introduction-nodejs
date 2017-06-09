import {readFile} from 'fs';
import {Foo} from './classes';

function load({path}) {
  return new Promise((resolve, reject) => {
    readFile(path, (err, data) => {
      if(err) {
        reject(err);
        return;
      }
      resolve({fileContent: data.toString()});
    });
  });
}

(async () => {
  const f1 = new Foo();
  console.log(f1)

  try {
    const {fileContent} = await load({path: '123.txt'});
    const gg = await load({path: '123.txt'});

    console.log(fileContent);
  } catch(error) {
    console.error(error);
  }
})();