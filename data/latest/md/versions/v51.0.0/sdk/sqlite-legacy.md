---
title: SQLite (legacy)
description: A library that provides access to a database that can be queried through a WebSQL-like API.
sourceCodeUrl: https://github.com/expo/expo/tree/sdk-51/packages/expo-sqlite
packageName: expo-sqlite
iconUrl: /static/images/packages/expo-sqlite.png
platforms: ["android", "ios"]
---

`expo-sqlite` gives your app access to a database that can be queried through a [WebSQL](https://www.w3.org/TR/webdatabase/)-like API. The database is persisted across restarts of your app.

## Installation

## Usage

### Importing an existing database

To open a new SQLite database using an existing `.db` file you already have, follow the steps below:

Install `expo-file-system` and `expo-asset` modules:

Create a **metro.config.js** file at the root of your project with the following contents to include [extra asset extensions](/guides/customizing-metro/#adding-more-file-extensions-to--assetexts):

```js
const { getDefaultConfig } = require('expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.assetExts.push('db');

module.exports = defaultConfig;
```

Use the following function (or similar) to open your database:

```ts

async function openDatabase(pathToDatabaseFile: string): Promise<SQLite.SQLiteDatabase> {
  if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite')).exists) {
    await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite');
  }
  const asset = await Asset.fromModule(require(pathToDatabaseFile)).downloadAsync();
  await FileSystem.copyAsync({
    from: asset.localUri,
    to: FileSystem.documentDirectory + 'SQLite/myDatabaseName.db',
  });
  return SQLite.openDatabase('myDatabaseName.db');
}
```

### Executing statements with an async transaction

```js

const db = SQLite.openDatabase('dbName', version);

const readOnly = true;
await db.transactionAsync(async tx => {
  const result = await tx.executeSqlAsync('SELECT COUNT(*) FROM USERS', []);
  console.log('Count:', result.rows[0]['COUNT(*)']);
}, readOnly);
```

### Executing statements outside of a transaction

> You should use this kind of execution only when it is necessary. For instance, when code is a no-op within transactions. Example: `PRAGMA foreign_keys = ON;`.

```js

const db = SQLite.openDatabase('dbName', version);

await db.execAsync([{ sql: 'PRAGMA foreign_keys = ON;', args: [] }], false);
console.log('Foreign keys turned on');
```

## API

```js

```