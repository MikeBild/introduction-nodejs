function doSomething(name, callback) {
  console.log("Name: ", name);
  setTimeout(() => callback && callback("DONE"), 3000);
}

doSomething("djdjdj", fertigName => console.log("FETIG NAME: -> ", fertigName));
