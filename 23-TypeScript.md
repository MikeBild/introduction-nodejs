# TypeScript & NodeJS

- [Setup](#setup)
- [Testing](#testing)
- [Resources](#resources)

## Setup

- `npm install typescript @types/node --save-dev`
- `tsc --init`

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["es2015"],
    "rootDir": "src",
    "outDir": "dist",
    "module": "commonjs",
    "moduleResolution": "node",
    "strict": true,
    "declaration": true,
    "sourceMap": true,
    "inlineSources": true,
    "types": ["node", "mocha"]
  },
  "include": ["src/**/*"]
}
```

### `package.json`

```json
{
  "scripts": {
    "build": "tsc"
  },
  "devDependencies": {
    "@types/node": "^10.12.11",
    "typescript": "^3.2.1"
  }
}
```

### Testing

```json
{
  "scripts": {
    "test": "mocha dist/**/*.spec.js -R spec --bail"
  }
  "devDependencies": {
    "@types/mocha": "^5.2.5",
    "mocha": "^5.2.0",
  }
}
```

## Resources

- [TS-Node](https://github.com/TypeStrong/ts-node)
- [TS-Node-Dev](https://github.com/whitecolor/ts-node-dev)
