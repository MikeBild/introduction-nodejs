function add(x, y) {
  return x + y;
}

function add5(x = 0) {
  return add(x, 5);
}

function addY(x) {
  return y => add(x, y);
}

const add6 = addY(6);
const $12 = () => addY(6)(6);

console.log(add(1, 1));
console.log(add5(1));
console.log(add5(2));
console.log(add5());
console.log(add6(1));
console.log($12());

class Server {
  constructor(name) {
    this.name = name;
  }
}

function getProjects(dataSource) {
  // console.log("Before: ", dataSource);
  let result = dataSource.concat(dataSource);
  // console.log("After:", result);
  return result;
}

function withDefaultValuesDataSource(func) {
  return x => {
    return func(x || [new Project("cluster-1"), new Project("cluster-2")]);
  };
}

function withGoogleDataSource(func) {
  return x => {
    return func(x);
  };
}

function withLogger(func) {
  if (typeof func !== "function") throw new Exception("Should be a function!");
  return x => {
    console.log(typeof func, typeof x);
    console.log("Before: ", x);
    const result = func(x);
    console.log("After:", result);
    return result;
  };
}

const projectWithDefaultValueDataSource = withDefaultValuesDataSource(
  getProjects
);
const projectWithDefaultValueDataSourceWithLogger = withLogger(
  projectWithDefaultValueDataSource
)();

module.exports = {
  getProjects
};

function getProjects() {
  return compose(withLogger, withDefaultValuesDataSource, getProjects);
}
