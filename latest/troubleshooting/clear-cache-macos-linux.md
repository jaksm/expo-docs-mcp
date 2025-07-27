---
title: Clear bundler caches on macOS and Linux
description: Learn how to clear the bundler cache when using Yarn or npm with Expo CLI or React Native CLI on macOS and Linux.
---

> Need to clear development caches on Windows? [Find the relevant commands here.](/troubleshooting/clear-cache-windows/)

There are a number of different caches associated with your project that can prevent your project from running as intended. Clearing a cache sometimes can help you work around issues related to stale or corrupt data and is often useful when troubleshooting and debugging.

To clear the various caches, run:

## Expo CLI and Yarn

## Expo CLI and npm

## React Native CLI and Yarn

## React Native CLI and npm

## What these commands are doing

It is a good habit to understand commands you find on the internet before you run them. We explain each command below for Expo CLI, npm, and Yarn, but the corresponding commands React Native CLI have the same behavior.

| Command                   | Description                                                                   |
| ------------------------- | ----------------------------------------------------------------------------- |
| `rm -rf node_modules`     | Clear all of the dependencies of your project                                 |
| `yarn cache clean`        | Clear the global Yarn cache                                                   |
| `npm cache clean --force` | Clear the global npm cache                                                    |
| `yarn`/`npm install`      | Reinstall all dependencies                                                    |
| `watchman watch-del-all`  | Reset the `watchman` file watcher                                             |
| `rm -rf $TMPDIR/<cache>`  | Clear the given packager/bundler cache file or directory                      |
| `npx expo start --clear`  | Restart the development server and clear the JavaScript transformation caches |