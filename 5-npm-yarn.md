# NPM & Yarn

- [NPM](#npm)
  - [Global vs. Local](#global-vs-local)
  - [`package.json`](#package.json)
  - [Update versions](#update-versions)
- [Yarn](#yarn)
  - [Workspaces](#workspaces)

## NPM

### Global vs. Local

```bash
sudo npm install npm -g
```

```bash
npm install lodash
```

### `package.json`

```bash
npm init
```

### Update versions

```bash
npm update
```

### Publish to Repository

```bash
npm adduser
npm publish
```

### Ignore files

- add `.npmignore`

## Yarn

- the "new" JS Package Manager
- Backward compatible
- `yarn install`
- `yarn add ...`

### Workspaces

1. Create a `packages` folder in root
2. Copy your projects into the `packages` folder
3. Add a `packages.json` into your root

```json
{
  "private": true,
  "workspaces": ["packages/*"]
}
```
