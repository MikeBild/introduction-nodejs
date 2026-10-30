# The shop as an npm monorepo

Two packages that should be one system: `apps/api` (Express 5) carries a copy of `totalCents` from `packages/domain`, and the copy has drifted. The API forgets the quantity. `apps/api/src/app.test.ts` documents the bug, it passes for the wrong reason. The root is ready: `workspaces`, `devEngines` and an `.npmrc` with `install-strategy=linked` and `min-release-age=7`.

## Setup

This exercise needs Node.js 26 and npm 12. Node.js 26 ships npm 11.20, so update npm first:

```sh
npm install -g npm@12
npm --version
```

`devEngines.packageManager` stops every `npm ci`, `npm install` and `npm run` with `EBADDEVENGINES` on an older npm. `npx npm@12 ci` fails the same way, because the npm 11 that starts `npx` checks `devEngines` first.

Run npm only inside this folder. It is a monorepo of its own, the repository around it has no root `package.json`.

```sh
npm ci
npm test             # 2 tests in @shop/domain, 2 tests and 3 todos in @shop/api
npm run typecheck
PORT=3000 npm start  # http://localhost:3000/orders
```

`npm ci` may report blocked install scripts. That is expected, step 2 deals with it.

## Exercise

### Step 1: connect the packages

1. Run `npm test -w @shop/api` and read `apps/api/src/app.test.ts`: order `o-1` costs 5097 cents, the API says 3798.
2. Add `"@shop/domain": "*"` to `dependencies` in `apps/api/package.json` and run `npm install` in this folder. npm links the package, look at `apps/api/node_modules/@shop/domain`.
3. In `apps/api/src/app.ts`, import `totalCents` and the type `Order` from `@shop/domain`. Delete `src/total.ts` and the types in `src/orders.ts`. The tests now fail with `Failed to resolve entry for package "@shop/domain"`.
4. Add `"exports": { ".": "./src/index.ts" }` to `packages/domain/package.json`. Importing `@shop/domain/src/order.ts` now fails with `ERR_PACKAGE_PATH_NOT_EXPORTED`: only the public API is visible.
5. Replace the bug test and the first `it.todo` with a test for 5097 cents.
6. Run scripts from the root: `npm test -w @shop/api`, `npm test -w @shop/domain`, `npm test`.

Workspace dependencies use `"*"` here. `workspace:*` is pnpm and bun syntax, npm stops with `EUNSUPPORTEDPROTOCOL`.

### Step 2: catch a phantom dependency, review install scripts

`GET /orders?status=placed` should filter the orders. Create `apps/api/src/status-query.ts`:

```ts
import { OrderStatus } from '@shop/domain'
import { z } from 'zod'

export const StatusQuery = z.strictObject({ status: OrderStatus.optional() })
```

Do not touch `apps/api/package.json`: `zod` is a dependency of `@shop/domain`, not of `@shop/api`. Use `StatusQuery.safeParse(req.query)` in the route, answer 400 if it fails, filter otherwise. Turn the two remaining `it.todo` entries into tests.

Under `linked`, the import fails:

```sh
npm test -w @shop/api
# Error: Cannot find package 'zod' imported from .../apps/api/src/status-query.ts
npm run typecheck
# src/status-query.ts(2,19): error TS2307: Cannot find module 'zod' or its corresponding type declarations.
```

`npm start` stops with the same missing package, code `ERR_MODULE_NOT_FOUND`.

Now install with `hoisted`, the npm default, without changing any file:

```sh
npm ci --install-strategy=hoisted
ls node_modules/zod
npm test -w @shop/api
npm run typecheck
```

Tests and typecheck pass: `zod` lands in the root `node_modules` and every package finds it by accident. `package-lock.json` stays byte-identical, the strategy only changes the folder layout. The `.npmrc` brings `linked` back:

```sh
npm ci
ls node_modules/zod                # No such file or directory
npm install zod -w @shop/api       # declare what you import
npm test
```

Then review the install scripts, starting with a clean install:

```sh
npm ci
npm install-scripts ls
```

On macOS, npm lists `fsevents@2.3.3`, an optional dependency of the test tooling. The tests pass although its script never ran, so you do not need it. Record that decision in the root `package.json`:

```sh
npm install-scripts deny fsevents   # writes "allowScripts": { "fsevents": false }
npm ci                              # no warning anymore
npm test
```

On Linux and Windows `fsevents` is not installed and the list is empty. Look at `allowScripts` in `solution/package.json` instead.

If a package really needs its script, `npm install-scripts approve <pkg>` writes a pinned entry such as `"esbuild@0.28.2": true`. Run `npm ci` afterwards. Run `npm install-scripts` in the root, the command does not support workspaces.

`npm rebuild esbuild` is not reliable under `linked`: npm 12.2.1 started the postinstall script twice, and one of three runs failed. Use `npm ci` here.

### Step 3: tooling as a package

1. Create the workspace: `npm init -y -w packages/cli --scope=@shop`. npm writes a `test` script that always fails and `"type": "commonjs"`. Set `"type": "module"`, remove `main`, and use the `test` and `typecheck` scripts and the `tsconfig.json` from `@shop/domain`.
2. Add `"bin": { "shop": "src/cli.ts" }` and `"dependencies": { "@shop/domain": "*" }`.
3. Write `src/cli.ts` with `#!/usr/bin/env node` as first line: `shop total <file>` prints one line per order with id and total, using `Orders` and `totalCents` from `@shop/domain`. Wrong usage sets exit code `2`. Argument parsing is covered in `EXAMPLES/CLI/orders-report`.
4. Add a test for the report in `src/report.test.ts`. Vitest exits with `1` when a workspace has no test file.
5. Run `npm install`. Now call the tool from the root:

```sh
npx shop total data/orders.json                        # npm error could not determine executable to run
npm exec -w @shop/cli -- shop total data/orders.json   # works, if the path is right
```

Under `linked`, a workspace `bin` is not linked into the root `node_modules/.bin`, so `npx` asks the registry for a package called `shop`. One exists, it just has no `bin`, which causes the error. With a `bin` it would have been foreign code. `npm exec -w` reads the `bin` field of the workspace instead, but runs in `packages/cli`, so a plain `resolve(file)` fails with `ENOENT` for `packages/cli/data/orders.json`. Resolve against `process.env.INIT_CWD`, the folder you called npm from:

```ts
const path = resolve(process.env.INIT_CWD ?? process.cwd(), file)
```

6. Give the team one command, in the root `package.json`:

```json
"scripts": { "shop": "npm exec -w @shop/cli -- shop" }
```

```sh
npm run shop -- total data/orders.json
# o-1	5097
# o-2	7497
npm run shop; echo $?      # usage on stderr, exit code 2
```

## Solution

`solution/` is the finished monorepo with its own lockfile, nothing in it belongs to the workspaces of this folder:

```sh
cd solution
npm ci
npm test
npm run shop -- total data/orders.json
```
