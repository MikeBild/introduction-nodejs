// Destructing

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
  { a, b = 'default', hello: { world } = {}, show } = { show: () => ({}) }
) {
  console.log(`As function call: ${a}, ${b}, ${world}`);
  show();
}
