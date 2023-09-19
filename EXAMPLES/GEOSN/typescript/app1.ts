import { writeFile } from "fs";

// npm install typescript @types/node ts-node-dev -D
// npx tsc --init
// npx tsc app1.ts
const result = add(2, 2);

writeFile("result.txt", result.toString(), null, (error) => {
  if (error) {
    console.error(error);
    return;
  }

  console.log("File successful written.");
});

console.log(result);

export function add(a: number, b: number): number {
  return a + b;
}
