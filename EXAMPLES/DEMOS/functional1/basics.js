[1, 2, "Fizz", 4, "Buzz"];

const myFizzBuzz = {
  "1": 1,
  "2": 2,
  "3": "Fizz",
  "4": 4,
  "5": "Buzz"
};

const fs = require("fs");

const simpleList = [1, "aaa", 1, 1];
const doubler = (x, index, source) => {
  return x + x;
};
const isNumber = (x, index, source) => parseInt(x);

const doubleList = simpleList
  .filter(isNumber)
  .map(doubler)
  .map(doubler)
  .forEach(x => {
    console.log(x);
  });

console.log(doubleList);

const sum = simpleList
  .filter(isNumber)
  .reduce((state, element, idx, source) => {
    if (idx >= 2) return state;
    return (state += element);
  }, 0);

console.log(sum);

const logsContent = fs.readFileSync("./demo.log");
const logs = logsContent.toString().split("\n");
const metric = logs.map(x => x.split(" ")).reduce(
  (state, element) => {
    const statusCode = element[2];
    const method = element[0];
    //methods metric
    if (!state.methods[method]) state.methods[method] = 0;
    state.methods[method] += 1;
    //status code metric
    if (!state.statusCodes[statusCode]) state.statusCodes[statusCode] = 0;
    state.statusCodes[statusCode] += 1;
    return state;
  },
  {
    methods: {
      GET: 0,
      POST: 0
    },
    statusCodes: {
      "200": 0,
      "404": 0,
      "304": 0
    }
  }
);

console.log(metric);

const arrayFizzBuzz = Object.keys(myFizzBuzz).reduce(
  (state, element) => state.concat([myFizzBuzz[element]]),
  []
);

console.log(arrayFizzBuzz);
