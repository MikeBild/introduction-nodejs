// Destructing Objects

foo({
  a: 'a',
  b: undefined,
  hello: {
    world: 'helloworld',
  },
  show: () => console.log('Hello World'),
});

foo();

function foo(
  { a: theFirstValue, b = 'default', hello: { world } = {}, show } = {
    show: () => ({}),
  }
) {
  console.log(`As function call: ${theFirstValue}, ${b}, ${world}`);
  show();
}

// Destructing Array
const [first, second, third] = [1, 2, 3, 4];

console.log(`Array destruction: ${first} ${second}`);

// Object Spread
const obj1 = { foo: 'foo' };
const obj2 = { bar: 'bar' };

const newObj = { bar: '2828', ...obj1, ...obj2, foo: 'iwiwi' };
console.log(newObj);

// Array Spread
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const newArr = [...arr1, 9, 8, 7, ...arr2];
console.log(newArr);

// Object instances with constructor functions and classes
function User(id) {
  this.id = id;
  this.show = () => {
    console.log(this);
  };
}

function AdvancedUser(id, name) {
  const user = new User(id);
  this.id = user.id;
  this.name = name;
  this.show = () => {
    user.show();
    consule.log(this);
  };
}

User.prototype.show = function() {
  this.show();
  console.log(this);
};

const user1 = new User(1);
const user2 = new User(2);
console.log({ user1, user2 });
user1.show();
user2.show();

class Customer {
  constructor(id) {
    this.id = id;
  }

  show() {
    console.log('Base', this);
  }
}

class SimpleCustomer extends Customer {
  constructor(id, name) {
    super(id);
    this.name = name;
  }
  show() {
    super.show();
    console.log('Simple', this);
  }
}

const customer1 = new Customer(1);
const customer2 = new Customer(2);
console.log({ customer1, customer2 });
customer1.show();

const customer3 = new SimpleCustomer(3, 'Joe');
const customer4 = new SimpleCustomer(4, 'Max');
console.log({ customer3, customer4 });
customer3.show();

function Manager(id, name) {
  return {
    id,
    name,
    show() {
      console.log(this);
    },
  };
}

const manager1 = Manager(1, 'Max');
const manager2 = Manager(2, 'Joe');
manager1.show();
