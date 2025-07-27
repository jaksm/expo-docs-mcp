---
title: iOS Developer Mode
description: Learn how to enable iOS developer mode on iOS 16 and above to run internal distribution builds and local development builds.
---

> This does not apply to builds signed using enterprise provisioning or to any builds installed on an iOS Simulator.

Devices running iOS 16 and above need to enable OS-level **Developer Mode** setting before they can run [internal distribution](/build/internal-distribution) builds (including those built with EAS) or local development builds after installing them on the device.

There are two ways you can enable Developer Mode on your device:

- Directly on an iOS device
- By connecting an iOS device with a Mac that has Xcode installed

## Prerequisites

The instructions specified below need to be followed once per device.

## Enable Developer Mode

### Directly on an iOS device

To follow the steps below, **install your development build on your device before enabling the Developer Mode.** When the build is created, follow the instructions on the EAS dashboard to install it on your iOS device.

Once the build is installed on your device, press the app icon. This will open an alert asking you to enable Developer Mode. Press **OK**.

Go to the Settings app, and navigate to **Privacy & Security** > **Developer Mode**.

Enable the toggle. You will receive a prompt from iOS to restart your device. Press **Restart**.

After the device restarts, unlock your device. A system alert should appear. Press **Turn On** and then, when prompted, enter your device's passcode.

Developer Mode is now enabled. You can now interact with your internal distribution builds and local development builds.

You can turn off Developer Mode at any time. However, you'll need to repeat this same process to re-enable it.

### Connect an iOS device with a Mac

> **Note:** Xcode must be installed on the Mac device before following the steps below.

You don't need to install the development build on your iOS device first to enable Developer Mode by connecting it to a Mac. You can:

Connect your iOS device to a Mac using a USB cable. Press **Trust** on your iOS device when **Trust This Computer?** alert is prompted.

Open Xcode, and from the menu bar, navigate to **Window** > **Devices and Simulators**.

Under **Devices**, you'll see a warning "Previous preparation error: Developer Mode disabled" with instructions on enabling Developer Mode on the iOS device.

On the iOS device, open **Settings** > **Privacy & Security** > **Developer Mode**.

Enable the toggle. You will receive a prompt from iOS to restart your device. Press **Restart**.

After the device restarts, unlock your device. A system alert should appear. Press **Turn On**, and enter your device's passcode when prompted.

Developer Mode is now enabled. You can now interact with your internal distribution builds and local development builds.

You can turn off Developer Mode at any time. However, you'll need to repeat this same process to re-enable it.