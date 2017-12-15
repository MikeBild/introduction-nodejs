const props = { foo: "bar", bar: "foo", error: { msg: "fail" } };
// console.log(props.foo);

const { foo } = props;
// console.log(foo);

printf(props);
// printf();

function printf({ foo, bar, foo2 = "mike", error: { msg } }) {
  console.log(foo, bar, foo2, msg);
}

//Construction

const name = "mike";
const user = {
  [name]: "dkdkd",
  name,
  load() {}
};

const login = {
  password: "kskd"
};
// console.log(user);
// Object.assign({}, user, {email: 'dskdj'})
const account = {
  ...user,
  ...login,
  email: "dsdskdjk@ajd.run"
};

// console.log(account);

const example = [{ id: "sjsjs" }, { id: "sksks" }].reduce(
  (state, { id }, index) => ({ ...state, [index + 1]: id }),
  {}
);

// console.log(example);

// Arrays
const example2 = ["A", "b", "c"];
const moreExample2 = ["1", ...example2, "Demo"];
console.log(moreExample2);
const [demo, b, ...rest] = example2;
console.log("A:", demo);
console.log("B:", b);
console.log("Rest:", ...rest);

// const example3 = { ...example2 };
// console.log(example3);
