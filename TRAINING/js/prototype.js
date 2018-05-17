const myObj = {};

// Ganz alt!
// function Person(name) {
//   return {
//     name: name,
//     log: () => console.log(name)
//   };
// }
// const person1 = Person("Mike");
// const person2 = Person("Paul");

function Person(name) {
  this.name = name;
  this.log = () => console.log(this.name);
}

Person.prototype.isValid = function() {
  return this.name != null && this.name != undefined && this.name != "";
};

const person1 = new Person("Mike");
person1.log();
console.log(person1.isValid());
console.log(Person);
console.log(person1);
const person2 = new Person("");
console.log(person2.isValid());
person2.log();
