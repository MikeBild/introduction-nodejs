module.exports = fizzbuzz;

function fizzbuzz(count = 100) {
  const input = new Array(count).fill(1);
  return input.map((x, i) => {
    i += 1;
    if (i % 15 === 0) return "FizzBuzz";
    if (i % 3 === 0) return "Fizz";
    if (i % 5 === 0) return "Buzz";
    return i;
  });
}
