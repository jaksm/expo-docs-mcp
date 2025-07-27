---
title: Distribution: Overview
sidebar_title: Overview
hideTOC: true
description: An overview of submitting an app to the app stores or with the internal distribution.
---

Get your app into the hands of users by submitting it to the app stores or with [Internal Distribution](/build/internal-distribution).

You can run `eas build --auto-submit` with [EAS CLI](/eas) to build your app and automatically upload the binary for distribution on the Google Play Store and Apple App Store.

This automatically manages **all native code signing** for Android and iOS for any React Native app. Advanced features such as payments, notifications, universal links, and iCloud can be automatically enabled based on your [config plugins](/config-plugins/introduction/) or native entitlements, meaning no more wrestling with slow portals to get libraries set up correctly.

### Get started