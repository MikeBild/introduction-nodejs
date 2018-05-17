const myObj = {
  cluster1: {},
  "cluster-2": {}
};

Object.keys(myObj)
  .map(x => [x, myObj[x]])
  .reduce((state, i) => {
    state[i[0]] = i[1];
    return state;
  }, {});
