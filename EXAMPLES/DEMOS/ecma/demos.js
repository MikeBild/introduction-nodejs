import fetch from 'isomorphic-fetch';

const {doSome} = {
  foo: 'bar',
  doSome: doSome2,
};

doSome({});

function doSome2 ({port = 9090}) {
  console.log(port);
}

function extend (shoe = {}) {
  const newShow =  {...shoe, id: 4};
  return newShow;
}

class Base {
  constructor () {
    console.log('from base');
  }
}

class Foo extends Base {
  constructor({bar = 9}) {
    super();
    this.bar = bar;
  }

  doSome () {
    console.log(this.bar);
  }
}

const f1 = new Foo({bar: 5});
// f1.bar = 11;
f1.doSome();

async function load () {
  const response = await fetch(`https://api.github.com/gists/public`);
  const publicGists = await response.json();
  return publicGists.map(x => x.commits_url);
};

load()
.then(console.log)
.catch(console.error)