import {readFile} from 'fs';
import Foo, {Bar} from './classes';
import {withdraw, balance, add} from './konto-transactions'

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

function hello(a, b, ...values) {
  console.log(a, b, Array.prototype.slice.call(arguments), values)
}

(async () => {
  // hello('A', 'B', 'C', 'D')

  const a = {
    foo: 'bar',
    a: '1',
  }

  const b = {
    bar: 'foo',
    a: '2',
  }

  const all = {
    all: 'foo + bar',
    ...a,
    ...b,
  }
  // console.log(all)

const myArray = ['shoulders', 'knees']
const myNewArray = ['head', ...myArray, 'and', 'toes']
// console.log(myNewArray)

const allKeys = Object.keys(all).map(x => all[x])
// console.log(allKeys)

// ['A', 'B', 'C'].forEach(x => console.log(x))

const results = [1, 2, 3, 4]
  .filter(x => x % 2 === 0)
  .map((x, i) => {
    return x + x + i
  })
  .reduce((state, element) => {
    state += element;
    return state;
  }, 0);

// console.log(results)

  withdraw(30);
  withdraw(20);
  add(60);
  console.log(balance());

  Foo.bar()
  const f1 = new Foo('1234');
  f1.foo()
  const b1 = new Bar();
  // console.log(b1, f1)

  try {
    const {fileContent} = await load({path: '123.txt'});
    const gg = await load({path: '123.txt'});

    // console.log(fileContent);
  } catch(error) {
    console.error(error);
  }
})();