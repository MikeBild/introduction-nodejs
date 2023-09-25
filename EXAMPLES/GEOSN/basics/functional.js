const source = "A B C";
const sourceList = source.split("");

const filtered = sourceList.filter(isNonEmtpy);
const mapped = filtered.map(charToData);
const reduced = mapped.reduce((state, x) => {
  return (state += `${x.charLC} `);
}, "");

console.log({ sourceList, filtered, mapped, reduced: reduced.trimEnd() });

function isNonEmtpy(x) {
  return x != " ";
}

function charToData(x) {
  return {
    charOriginal: x,
    charLC: x.toLowerCase(),
  };
}

// Partial Application Function
function add(a) {        
  return (b) => {
    return a + b;
  };
}

const add1 = add(1);
const add10 = add(10);

console.log(add1(1));
console.log(add1(5));
console.log(add1(9));
console.log(add10(1));
console.log(add10(9));
