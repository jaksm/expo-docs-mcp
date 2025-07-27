---
title: How to use a standalone Expo module
description: Learn how to use a standalone module created with create-expo-module in your project by using a monorepo or publishing the package to npm.
---

**The recommended way to create an Expo module** in an existing project is described in the [Expo Modules API: Get Started](/modules/get-started/) guide. This tutorial explains two additional methods for using a module created with `create-expo-module` in an existing project:

- [Configure a monorepo](#use-a-monorepo)
- [Publish the module to npm](#publish-the-module-to-npm)

These methods are useful if you still want to keep the module separate from the application or share it with other developers.

## Use a monorepo

Your project should use the following structure:

- **apps**: A directory to store multiple projects, including React Native apps.
- **packages**: A directory to keep different packages used by your apps.
- **package.json**: This is the root package file that contains the Yarn workspaces configuration.

> **info** To learn how to configure your project as a monorepo, check out the [Working with monorepos](/guides/monorepos/) guide.

### Initialize a new module

Once you have set up the basic monorepo structure, create a new module using `create-expo-module` with the flag `--no-example` to skip creating the example app:

### Set up workspace

Configure `autolinking` so your apps can use the new module. Add the following block to the **package.json** file in each app inside the **apps** directory:

```json package.json
"expo": {
  "autolinking": {
    "nativeModulesDir": "../../packages"
  }
}
```

### Run the module

Run one of your apps to ensure everything works. Then, start the TypeScript compiler in **packages/expo-settings** to watch for changes and rebuild the module's JavaScript:

Open another terminal window, select an app from the **apps** directory, and run the `prebuild` command with the `--clean` option. Repeat these steps for each app in your monorepo to use the new module.

Compile and run the app with the following command:

You can now use the module in your app. To test it, edit the **app/(tabs)/index.tsx** file in your app and render the text message from the `expo-settings` module:

```tsx app/(tabs)/index.tsx

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>{Settings.hello()}</Text>
    </View>
  );
}
```

After this configuration, the app displays the text "Hello world! 👋".

## Publish the module to npm

You can publish the module on npm and install it as a dependency in your project by following the steps below.

### Initialize a new module

Start by creating a new module with `create-expo-module`. Follow the prompts carefully, as you will publish this library, and choose a unique name for your npm package.

### Run the example project

Run one of your apps to ensure everything works. Then, start the TypeScript compiler in the root of your project to watch for changes and rebuild the module's JavaScript:

Open another terminal window, compile and run the example app:

### Publish the package to npm

To publish your package to npm, you need an npm account. If you don't have one, create an account on [the npm website](https://www.npmjs.com/signup). After creating an account, log in by running the following command:

Navigate to the root of your module, then run the following command to publish it:

Your module will now be published to npm and can be installed in other projects using `npm install`.

Apart from publishing your module to npm, you can use it in your project in the following ways:

- **Create a tarball**: Use `npm pack` to create a tarball of your module, then install it in your project by running `npm install /path/to/tarball`. This method is helpful for testing your module locally before publishing it or sharing it with others who don't have access to the npm registry.
- **Run a local npm registry**: Use a tool such as [Verdaccio](https://verdaccio.org/) to host a local npm registry. You can install your module from this registry, which is useful for managing internal packages within a company or organization.
- **Publish a private package**: [Use a private registry with EAS Build](/build-reference/private-npm-packages/) to manage private modules securely.

### Test the published module

To test the published module in a new project, create a new app and install the module as a dependency by running the following command:

You can now use the module in your app! To test it, edit **app/(tabs)/index.tsx** and render the text message from **expo-settings**.

```tsx app/(tabs)/index.tsx

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>{Settings.hello()}</Text>
    </View>
  );
}
```

Finally, prebuild your project and run the app by executing the following commands:

After this configuration, you see the text "Hello world! 👋" displayed in the app.

## Next steps