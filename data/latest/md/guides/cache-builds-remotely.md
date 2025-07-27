---
title: Use build cache providers
sidebar_title: Cache builds remotely
description: Accelerate local development by caching and reusing builds from a provider.
---

Build caching is an experimental feature that speeds up `npx expo run:[android|ios]` by caching builds remotely, based on the project [fingerprint](/versions/latest/sdk/fingerprint/).
When you run `npx expo run:[android|ios]`, it checks if a build with a matching fingerprint exists, then downloads and launches it rather than compiling it again. Otherwise, the project is compiled as usual and then the resulting binary is uploaded to the remote cache for future runs.

## Using EAS as a build provider

To use the EAS Build provider plugin, start by installing the `eas-build-cache-provider` package as a developer dependency:

Then, update your **app.json** to include the `buildCacheProvider` property and its provider under `experiments`:

```json app.json
{
  "expo": {
    ...
    "experiments": {
      "buildCacheProvider": "eas"
    }
  }
}
```

You can roll your own cache provider by exporting a plugin that implements the following methods:

```ts
type BuildCacheProviderPlugin<T = any> = {
  /**
   * Try to fetch an existing build. Return its URL or null if missing.
   */
  resolveBuildCache(props: ResolveBuildCacheProps, options: T): Promise<string | null>;

  /**
   * Upload a new build binary. Return its URL or null on failure.
   */
  uploadBuildCache(props: UploadBuildCacheProps, options: T): Promise<string | null>;

  /**
   * (Optional) Customize the fingerprint hash algorithm.
   */
  calculateFingerprintHash?: (
    props: CalculateFingerprintHashProps,
    options: T
  ) => Promise<string | null>;
};

type ResolveBuildCacheProps = {
  projectRoot: string;
  platform: 'android' | 'ios';
  runOptions: RunOptions;
  fingerprintHash: string;
};
type UploadBuildCacheProps = {
  projectRoot: string;
  buildPath: string;
  runOptions: RunOptions;
  fingerprintHash: string;
  platform: 'android' | 'ios';
};
type CalculateFingerprintHashProps = {
  projectRoot: string;
  platform: 'android' | 'ios';
  runOptions: RunOptions;
};
```

A reference implementation using GitHub Releases to cache builds can be found in the [Build Cache Provider Example](https://github.com/expo/examples/tree/master/with-github-remote-build-cache-provider).

## Creating a custom build provider

Start by creating a **provider** directory for writing the provider plugin in TypeScript and add a **provider.plugin.js** file in the project root, which will be the plugin's entry point.

### Create a `provider/tsconfig.json` file

```json provider/tsconfig.json
{
  "extends": "expo-module-scripts/tsconfig.plugin",
  "compilerOptions": {
    "outDir": "build",
    "rootDir": "src"
  },
  "include": ["./src"],
  "exclude": ["**/__mocks__/*", "**/__tests__/*"]
}
```

### Create a `provider/src/index.ts` file for your plugin

```ts provider/src/index.ts

const plugin: BuildCacheProviderPlugin {
  resolveBuildCache: () => {
    console.log('Searching for remote builds...')
    return null;
  },
  uploadBuildCache: () => {
    console.log('Uploading build to remote...')
    return null;
  },,
};

```

### Create an `provider.plugin.js` file in the root directory

```js provider.plugin.js
// This file configures the entry file for your plugin.
module.exports = require('./provider/build');
```

### Build your provider plugin

At the root of your project, run `npm run build provider` to start the TypeScript compiler in watch mode.

### Configure your example project to use your plugin by adding the following line to the `example/app.json` file:

```json example/app.json
{
  "expo": {
    ...
    "experiments": {
      "buildCacheProvider": {
        "plugin": "./provider.plugin.js"
      }
    }
  }
}
```

### Test your provider
When you run the `npx expo run` command inside your **example** directory, you should see your plugin's console statements in the logs.

That's it! You now have a remote build cache provider to speed up your builds.

### Passing custom options

To inject custom options to your plugin you can use the `options` field and it will be forwarded as the second parameter of your custom functions. To do so modify the `buildCacheProvider` field in **example/app.json** as shown below:

```json example/app.json
{
  "expo": {
    ...
    "experiments": {
      "buildCacheProvider": {
        "plugin": "./provider.plugin.js",
        "options": {
          "myCustomKey": "XXX-XXX-XXX"
        }
      }
    }
  }
}
```