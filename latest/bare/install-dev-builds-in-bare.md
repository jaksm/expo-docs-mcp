---
title: Install expo-dev-client in an existing React Native project
sidebar_title: Install expo-dev-client
description: Learn how to install and configure expo-dev-client in your existing React Native project.
---

The following guide explains how to install and configure `expo-dev-client` in an existing React Native project.

If you're starting with a new project, create it using the `with-dev-client` template:

To use `expo-dev-client` in a project that uses [CNG](/workflow/continuous-native-generation/), see [Create a development build](/develop/development-builds/create-a-build/).

## Prerequisites

**The `expo` package must be installed and configured.** If you created your project with `npx @react-native-community/cli@latest init` and do not have any other Expo libraries installed, you will need to [install Expo modules](/bare/installing-expo-modules) before proceeding.

## Install expo-dev-client

Add the `expo-dev-client` library to your **package.json**:

If your project has an **ios** directory on disk, run the following command to fully install the native code for `expo-dev-client`:

If your project doesn't have an **ios** directory, you can skip this step.

## Configure deep links

Expo CLI uses a deep link to launch your project, and it's also useful if you use plan to [use `expo-dev-client` for launching preview updates](/eas-update/getting-started/) if you have added a custom deep link scheme to your project.

If you haven't configured a `scheme` for your app yet to support deep linking, then use `uri-scheme` library to do this for you.

For more information, see the [`uri-scheme` library](https://www.npmjs.com/package/uri-scheme).

## Add additional optional configuration

For certain types of errors, you can obtain more helpful error messages when using `expo-dev-client`. To turn this on, import `expo-dev-client` in the project's **index** file. Make sure that the import statement is executed early, before your application's JS code is imported (place the import above `import App from './App'`).

```js

/* @hide ... */ /* @end */

```

For more information, see [Error handling](/develop/development-builds/use-development-builds/#add-error-handling).

## Build and install the app

Create a debug build of your app using the tools of your choice. For example, you can do this [locally with Expo CLI](/guides/local-app-development/) or [in the cloud with EAS Build](/develop/development-builds/create-a-build/).