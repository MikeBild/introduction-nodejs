const flow = 'A B C'.split('')
  .filter(x => x !== ' ')
  .map(x => (x + x).toLowerCase())
  .reduce((state, next) => {
    return state += next
  }, '-> ');

console.log(flow);
