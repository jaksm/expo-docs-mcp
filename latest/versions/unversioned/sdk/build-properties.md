---
title: BuildProperties
description: A config plugin that allows customizing native build properties during prebuild.
sourceCodeUrl: https://github.com/expo/expo/tree/main/packages/expo-build-properties
packageName: expo-build-properties
platforms: ["android", "ios", "tvos"]
---

`expo-build-properties` is a [config plugin](/config-plugins/introduction/) configuring the native build properties
of your **android/gradle.properties** and **ios/Podfile.properties.json** directories during [Prebuild](/workflow/prebuild).

> **info** This config plugin configures how [Prebuild command](/workflow/prebuild) generates the native **android** and **ios** directories
> and therefore cannot be used with projects that don't run `npx expo prebuild` (bare projects).

## Installation

## Usage

<Tabs>

<Tab label="app.json">

```json app.json|collapseHeight=450
{
  "expo": {
    "plugins": [
      [
        "expo-build-properties",
        {
          "android": {
            "compileSdkVersion": 35,
            "targetSdkVersion": 35,
            "buildToolsVersion": "35.0.0"
          },
          "ios": {
            "deploymentTarget": "15.1"
          }
        }
      ]
    ]
  }
}
```

</Tab>

<Tab label="app.config.js">

```js app.config.js|collapseHeight=450

  expo: {
    plugins: [
      [
        'expo-build-properties',
        {
          android: {
            compileSdkVersion: 35,
            targetSdkVersion: 35,
            buildToolsVersion: '35.0.0',
          },
          ios: {
            deploymentTarget: '15.1',
          },
        },
      ],
    ],
  },
};
```

</Tab>

</Tabs>

### All configurable properties

[`PluginConfigType`](#pluginconfigtype) interface represents currently available configuration properties.

## API