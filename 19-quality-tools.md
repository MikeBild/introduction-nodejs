# Quality Tools

## Nodemon

> For use during development of a Node.js based application

```bash
npm install nodemon --save-dev
```

__package.json__
```json
"scripts": {
	"dev": "nodemon --watch ./ --ignore ./node_modules ./bin/www",
}
```

## ES Lint

> ESLint is a tool for identifying and reporting on patterns found in ECMAScript/JavaScript code

```bash
npm install eslint --save-dev
./node_modules/.bin/eslint --init
```

__package.json__
```json
"scripts": {
    "lint": "eslint ./"
}
```

## Process Manager / Supervisor

> CLI tool for ensuring that a given script runs continuously

```bash
npm install forever --save
forever start app.js
```

## Node-Inspector

> Node Inspector is a debugger interface for Node.js applications

```bash
npm install -g node-inspector
node-debug app.js
```

## Debug

```bash
npm install debug --save
```
