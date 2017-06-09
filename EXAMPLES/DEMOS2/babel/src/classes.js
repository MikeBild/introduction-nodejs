export class Bar {
  constructor() {
    // console.log('bar constructor')
  }
}

export default class Foo extends Bar {
  static bar() {
    // console.log('bar bar')
  }

  constructor(bla) {
    super();
    this.bla = bla;
    // console.log('foo constructor')
  }

  foo() {
    // console.log('just do it!')
  }
}
