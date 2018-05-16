if (
  (6 ===
    [1, 2, 3].reduce((sum, p) => {
      return sum + p;
    }),
  0)
) {
  console.log("YEAH");
}
