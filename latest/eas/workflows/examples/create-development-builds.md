---
title: Create development builds with EAS Workflows
sidebar_title: Create development builds
description: Learn how to create development builds with EAS Workflows.
hideTOC: true
---

[Development builds](/develop/development-builds/introduction/) are specialized builds of your project that include Expo's developer tools. These types of builds include all native dependencies inside your project, enabling you to run a production-like build of your project on a simulator, emulator, or a physical device. This workflow allows you to create development builds for each platform and for both physical devices, Android emulators, and iOS simulators, which your team can access with `eas build:dev`.

## Get started

  <Requirement number={1} title="Set up your environment">
    To get started, you'll need to configure your project and devices to build and run development builds. Learn how to set up your environment for development builds with the following guides:

  </Requirement>
  <Requirement number={2} title="Create build profiles">
  After you've configured your project and devices, add the following build profiles to your **eas.json** file.

```json eas.json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "development-simulator": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    }
  }
}
```

  </Requirement>

The following workflow creates a build for each platform and for both physical devices, Android emulators, and iOS simulators. They all will run in parallel.

```yaml .eas/workflows/create-development-builds.yml
name: Create development builds

jobs:
  android_development_build:
    name: Build Android
    type: build
    params:
      platform: android
      profile: development
  ios_device_development_build:
    name: Build iOS device
    type: build
    params:
      platform: ios
      profile: development
  ios_simulator_development_build:
    name: Build iOS simulator
    type: build
    params:
      platform: ios
      profile: development-simulator
```

Run the above workflow with: