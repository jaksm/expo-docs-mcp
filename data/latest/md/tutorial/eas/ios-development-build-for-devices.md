---
title: Create and run a cloud build for iOS device
sidebar_title: iOS development build for devices
description: Learn how to configure a development build for iOS devices using EAS Build.
hasVideoLink: true
---

In this chapter, we'll create a development build that can run on an iOS device with EAS Build.

Development builds for iOS devices are generated in the **.ipa** format, which is standard for iOS app installations.

---

## Prerequisites

Before we begin, ensure you have:

- **Apple Developer Account:** This is required to access [necessary credentials](/app-signing/app-credentials/#ios) for signing our app, as each build needs to be signed to verify that the app comes from a trusted source. EAS Build helps manage these credentials.
- **Developer Mode activated on iOS 16 and higher:** Installing development builds on your device requires Developer Mode to be enabled. If this is your first time or if it's currently disabled, see these instructions to [activate Developer Mode](/guides/ios-developer-mode/).

## Provisioning profile

To initiate development on an iOS device, we have to:

- Register the device by creating a new [provisioning profile](/app-signing/app-credentials/#provisioning-profiles).
- Download and install this profile onto the device.

### Register an iOS device

With EAS CLI, run the command to register a new Apple device:

This command prompts us with the following questions:

- **You're inside the project directory. Would you like to use the** **your-account-name** **account?** Press <kbd>Y</kbd>.
- **Apple ID.** For this step, enter your Apple ID. It will then log in to our Apple Developer account. Follow the steps in the terminal window.
- **How would you like to register your devices?** Select **Website** that generates a registration URL that can be opened on the iOS device.

> **info** **Tip**: If you or your team have multiple devices, you can share the provisioning profile link with those devices for downloading and installing the profile.

### Download and install profile

On a device's web browser, open the link provided in the previous step and tap the **Download Profile button**.

Open the **Settings** app, which prompts us to register our device.

Tap **Install** to register the iOS device.

After the provisioning profile is installed, our device redirects us back to the web browser, displaying a success message indicating the completion of the process.

## Development build for iOS device

### Create

To create a development build on an iOS device, make sure that under the `build.development` profile:

- The `developmentClient` is set to `true` in **eas.json**, which is done by the default configuration.
- Then, run the `eas build` command with `ios` as the platform and `development` as the build profile:

> **info** **Tip**: Next time you run `eas build` command, you can also use `-p` to specify the platform. It is short for `--platform`.

This command prompts us with the following questions when we create the build for the first time:

- **What would you like your iOS bundle identifier to be?** Press <kbd>return</kbd> to select the default value provided for this prompt. This will add [`ios.bundleIdentifier`](/versions/latest/config/app/#package) in **app.json** if it isn't already defined.
- **Do you want to log in to your Apple account?**. Since we are creating a development build for the first time, it will ask us to **Generate a new Apple Distribution Certificate**. Press <kbd>Y</kbd> both times.
- **Select a device for ad hoc build**. This is the key part, which is why we had to register a provisioning profile before. We can select one or all of our registered devices here and then press return to install that build on those devices later.

> **info** **Only if you have skipped [iOS Simulator chapter](/tutorial/eas/ios-development-build-for-simulators/):** You'll be prompted **iOS app only uses standard/exempt encryption?** Press <kbd>Y</kbd> to select the default value provided for this prompt. Since our app doesn't use encryption, it sets `ITSAppUsesNonExemptEncryption` in the **Info.plist** file to `NO` and manages the compliance check for the same when you are releasing your app to TestFlight/Apple App Store. When you are releasing your own app, and it uses encryption, you can select `N` to skip this prompt next time.

After responding, the build will queue up, and we can track its progress via a provided link by the EAS CLI in the EAS dashboard:

<Collapsible summary="What does a build details page contain?">

The build details page displays the build type, profile, Expo SDK version, app version, build number, last commit hash, and the identity of the developer or account owner who initiated the build.

In the above image, the current status of the **Build artifact** shows that the build is in progress. Upon completion, this section will offer an option to download the build. The **Logs** outlines every step taken during the iOS build process on EAS Build. For the sake of brevity, we won't explore each step in detail here. To learn more, see [iOS build process](/build-reference/ios-builds/).

</Collapsible>

<Collapsible summary="What is iOS bundle identifier?">

The `ios.bundleIdentifier` is a unique name of our app. If we publish our app right now, the Apple App Store will use this property and its value to identify our app on the store.

This notation is defined as `host.owner.app-name`. For example, our example app has `com.owner.stickersmash` where `com.owner` is the domain and `stickersmash` is our app name.

</Collapsible>

### Install

Once the build finishes, the Build artifact section gets updated, indicating that the build is complete:

This section provides the methods available for running the development build on an iOS device: Expo Orbit and Install button.

[Expo Orbit](https://expo.dev/orbit) allows for seamless installation of the development build on an iOS device. To use this method:

- Connect our iOS device to our developer machine using USB.
- Open the Orbit menu bar app.
- Select the **Device** in the Orbit app.

- On the EAS dashboard, under **Build artifact**, click the **Open with Orbit**.

After the build is installed, the Orbit app launches the development build on the device.

<Collapsible summary="Alternate: Use the Install button and QR code">

The **Install** button in the **Build artifact** section generates a QR code for easy installation:

- Click **Install** to display a popup with the QR code.

- Scan the QR code with our iOS device's camera to open and tap the link to download the development build on the device.

</Collapsible>

### Run

Start the development server by running the `npx expo start` command from the project directory:

- On the device, tap the app icon to open the development build.

- Use the account syncing feature by ensuring we're logged into both the EAS CLI and development build. As we're already logged into the EAS CLI, the next step is to log in through the UI of your development build.

- Tap **Fetch development servers** and select the server running from the list under Development servers.

## Summary