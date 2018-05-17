const promises = [1, 2, 3, 4]
  .map(x => fetch())

// So bitte!
const responses = await Promise.all(promises);

// So nicht!
.foreach(async (x) => {
  const response = await x()
})

