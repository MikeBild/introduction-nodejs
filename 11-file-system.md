# File System

`const fs = require('fs')`

## Synchronous vs. Asynchronous

```javascript
const fs = require('fs');

// Asynchronous read
fs.readFile('input.txt', (err, data) => {
  if (err) return console.error(err);

  console.log('Asynchronous read: ' + data.toString());
});

// Synchronous read
const data = fs.readFileSync('input.txt');
console.log('Synchronous read: ' + data.toString());

console.log('Done');
```

## Tools

- [fs-extra](https://www.npmjs.com/package/fs-extra)
