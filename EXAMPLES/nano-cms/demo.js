const nums = [1, 2, 3];
let summe = 0;

for (var x = 0; x < nums.length; x++) {
  summe = summe + nums[x];
}

console.log(summe);

const summe1 = nums.reduce((state, value) => (state += value), 0);

console.log(summe1);
