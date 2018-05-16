class Person {
  constructor(name) {
    this.name = name;
  }
  log() {
    console.log(this.name);
  }
}

class Mitarbeiter extends Person {
  static number(prefix) {
    return prefix + 825;
  }
  constructor(name) {
    super(name);
  }
  isValid() {
    return this.name != null && this.name != undefined && this.name != "";
  }
}

const person1 = new Person("Mike");
person1.log();
const person2 = new Mitarbeiter("Paul");
person2.log();
console.log(person2.isValid());
console.log(Mitarbeiter.number("miek"));
