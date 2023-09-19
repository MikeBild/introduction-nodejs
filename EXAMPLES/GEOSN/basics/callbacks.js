function writeLn(done) {
  setTimeout(() => {
    done();
  }, 0); // -> setTimeout(done)
}

console.log("A");
writeLn(() => {
  console.log("B");
  console.log("C");
});

