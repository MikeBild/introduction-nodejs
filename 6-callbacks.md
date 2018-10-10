# Callbacks

## Blocking vs. Non-blocking

```javascript
const fs = require('fs');
const data = fs.readFileSync('input.txt');

console.log(data.toString());
console.log('Done');
```

```javascript
const fs = require('fs');

fs.readFile('input.txt', (err, data) => {
  if (err) return console.error(err);
  console.log(data.toString());
});

console.log('Done');
```
