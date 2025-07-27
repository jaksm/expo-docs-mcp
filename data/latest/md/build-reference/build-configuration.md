---
title: Build configuration process
sidebar_title: Configuration process
description: Learn how EAS CLI configures a project for EAS Build.
---

In this guide, you will learn what happens when EAS CLI configures your project with `eas build:configure` (or `eas build`, which runs this same process if the project is not yet configured).

EAS CLI performs the following steps when configuring your project:

## Ask you about the platform(s) to configure

When you run the command for the first time, it will initialize your EAS project and ask you to select the platform(s) you want to configure. If you only want to use EAS Build for a single platform, that's fine. If you change your mind, you can come back and configure the other later.

## Create eas.json

The command will create an **eas.json** file in the root directory with the default configuration. It looks something like this:

```json eas.json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  }
}
```

If you have a bare project, it will look a bit different.

This is your EAS Build configuration. It defines three build profiles named `"development"`, `"preview"`, and `"production"` (you can have multiple build profiles like `"production"`, `"debug"`, `"testing"`, and so on) for each platform. If you want to learn more about **eas.json** see the [Configuration with **eas.json**](/build/eas-json) page.

## Configure the project

This step varies depending on the project type you have.

<Step label="3.1">

### Initialization complete

This completes the initialization of your project to be compatible with EAS Build.

### Expo project

If you haven't configured your **app.json** with `android.package` and/or `ios.bundleIdentifier` yet, EAS CLI will prompt you to specify them when you create your first build.

- `android.package` will be used as the Android application ID which is used to identify your app on the Google Play Store
- `ios.bundleIdentifier` will be used to identify you app on the Apple App Store

In the example above, the `eas build --platform android` command prompts to set the Android application ID. If you run the command with `--platform ios`, it will prompt you to set the iOS bundle identifier.

### Bare React Native project

There are no additional steps for bare projects.

</Step>

## Next steps

That's all there is to configuring a project to be compatible with EAS Build. There is one more step, if you set `cli.requireCommit` to `true` in your **eas.json** &mdash; you'll be prompted to commit all the changes we made for you. You can choose to review them before committing, and you can either specify the git commit message or use a default message.