# Buffers

- For Binary Data
- Dealing with TCP, File, etc. streams
- Store raw data similar to an array of integers
- Raw memory allocation outside the V8 heap
- Is a global class

## Create an uninitiated Buffer of 10 octets

`const buf = Buffer.from(10);`

## Create a Buffer from a given array

`const buf = Buffer.from([10, 20, 30, 40, 50]);`

## Buffer from a given string and optionally encoding type

`const buf = Buffer.from('Simply Easy Learning', 'utf-8');`

## Write into a Node Buffer

`buf.write(string[, offset][, length][, encoding])`

```javascript
const buf = Buffer.from(256);
const len = buf.write('Simply Easy Learning');

console.log(`Octets written ${len}`);
```

## Reading from Buffers

`buf.toString([encoding][, start][, end])`

```javascript
const buf = Buffer.from(26);
for (let i = 0; i < 26; i++) {
  buf[i] = i + 97;
}

console.log(buf.toString('ascii')); // outputs: abcdefghijklmnopqrstuvwxyz
console.log(buf.toString('ascii', 0, 5)); // outputs: abcde
console.log(buf.toString('utf8', 0, 5)); // outputs: abcde
console.log(buf.toString(undefined, 0, 5)); // encoding defaults to 'utf8', outputs abcde
```

## Convert Buffer to JSON representation of a Buffer

`buf.toJSON()`

```javascript
const buf = Buffer.from('Simply Easy Learning');
const json = buf.toJSON(buf);

console.log(json);
```

## Concatenate Buffers

`Buffer.concat(list[, totalLength])`

```javascript
const buffer1 = Buffer.from('TutorialsPoint ');
const buffer2 = Buffer.from('Simply Easy Learning');
const buffer3 = Buffer.concat([buffer1, buffer2]);
console.log('buffer3 content: ' + buffer3.toString());
```

## Compare Buffers

`buf.compare(otherBuffer);`

```javascript
const buffer1 = Buffer.from('ABC');
const buffer2 = Buffer.from('ABCD');
const result = buffer1.compare(buffer2);

if (result < 0) {
  console.log(buffer1 + ' comes before ' + buffer2);
} else if (result == 0) {
  console.log(buffer1 + ' is same as ' + buffer2);
} else {
  console.log(buffer1 + ' comes after ' + buffer2);
}
```

## Copy Buffer

`buf.copy(targetBuffer[, targetStart][, sourceStart][, sourceEnd])`

```javascript
const buffer1 = Buffer.from('ABC');

//copy a buffer
const buffer2 = Buffer.from(3);
buffer1.copy(buffer2);
console.log('buffer2 content: ' + buffer2.toString());
```

## Slice Buffer (sub-buffer of a node buffer)

`buf.slice([start][, end])`

```javascript
const buffer1 = Buffer.from('TutorialsPoint');

//slicing a buffer
const buffer2 = buffer1.slice(0, 9);
console.log('buffer2 content: ' + buffer2.toString());
```
