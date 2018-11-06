const generator = gen();
const first = generator.next();
const second = generator.next();
const third = generator.next();
const none = generator.next();
const none2 = generator.next();

console.log({ first, second, third, none, none2 });

function* gen() {
  yield 1;
  yield 2;
  return 3;
}
