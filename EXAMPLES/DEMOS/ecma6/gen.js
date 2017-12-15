function* counter() {
  yield 1;
  yield 2;
  yield 3;
}

const gen = counter();

console.log(gen.next().value);
console.log(gen.next().value);
console.log(gen.next().value);
console.log(gen.next().value);

for (const val of counter()) {
  console.log(val);
}
