const users = [
  { name: "Mike", pets: ["Bao"], title: "Consultant" },
  { name: "John", age: 19, pets: ["Civelek", "Muazzam"] },
  { name: "Julika", age: 52, title: "Engineer" }
];

function has(propertyKey) {
  return function(x) {
    return x.hasOwnProperty(propertyKey);
  };
}

// const has = pK => x => x && pK && x.hasOwnProperty(pK);

const hasTitle = x => has("title")(x);
const hasAge = x => has("age")(x);

const newUsers = users.filter(hasTitle).filter(hasAge);

console.log(newUsers);

const createUser = id => ({
  id: id || 0
});

function printify(fn) {
  return id => {
    const inner = fn(id);
    inner.print = () => console.log(inner);
    return inner;
  };
}

function loader(fn) {
  return id => {
    const inner = fn(id);
    inner.loader = () => (inner.id = "kjdksjd");
    return inner;
  };
}

const newUser = createUser(99);

const printifiedNewUser = printify(createUser);
console.log(printifiedLoaderNewUser);

// const loaderprinifyUser = compose(
//   loader,
//   printify,
// )(createUser);

// loaderprinifyUser(99);
