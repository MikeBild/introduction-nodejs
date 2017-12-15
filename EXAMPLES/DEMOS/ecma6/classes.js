class User {
  constructor(id) {
    this.id = id;
    this.name = "mike";
  }
  print() {
    console.log(this);
  }
}

class Person extends User {
  constructor(id) {
    super(id);
    this.nachname = "bild";
  }
  print() {
    super.print();
    console.log("more...");
  }
}

const user1 = new User(99);
user1.print();

const person1 = new Person(22);
person1.print();
