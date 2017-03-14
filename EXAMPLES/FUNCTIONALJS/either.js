function either(f, g) {
  return function () {
    return f.apply(this, arguments) || g.apply(this, arguments);
  }
}

const gt10 = x => x > 10;
const even = x => x % 2 === 0;
const f = either(gt10, even);

console.log(f(7))
console.log(f(100))
