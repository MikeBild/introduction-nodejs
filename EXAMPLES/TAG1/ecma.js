// Destructing Objects

foo({
  a: 'a',
  b: undefined,
  hello: {
    world: 'helloworld',
  },
  show: () => console.log('Hello World'),
});

foo();

function foo(
  { a: theFirstValue, b = 'default', hello: { world } = {}, show } = {
    show: () => ({}),
  }
) {
  console.log(`As function call: ${theFirstValue}, ${b}, ${world}`);
  show();
}

// Destructing Array

const [first, second, third] = [1, 2, 3, 4];

console.log(`Array destruction: ${first} ${second}`);
