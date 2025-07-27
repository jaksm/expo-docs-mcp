---
title: Overview of distributing apps for review
sidebar_title: Distributing apps for review
description: Learn about how to distribute your app for review using app stores, internal distribution, and EAS Update.
---

This page outlines three approaches to sharing a preview version of your app with your team for QA and review: app store testing tracks, internal distribution, and development builds with EAS Update.

Even though Expo Go is an open-source sandbox that can be good for previewing isolated prototypes on Android and iOS, it is not intended for production apps. It should be avoided during the preview process of your app.

## App store testing tracks

When distributing apps through app store testing tracks, you can only use release builds. You cannot use this method to distribute development builds. An alternative approach is to use ["Internal distribution"](#internal-distribution-with-eas-build), which works with both release and development builds.

Before a complete public release, [Google Play beta](https://support.google.com/googleplay/android-developer/answer/9845334?visit_id=638740965629093187-3840249980&rd=1) is another option to distribute your app to testers. You can set up either an internal, closed, or open test track and control who has access to the app.

Each test track has its own requirements. For the internal track, you can only invite up to 100 testers. Both closed and open tracks support larger groups of testers. In closed tracks, you need to invite testers, while in open tracks, anyone can join your program.

To use Google Play beta, you need to upload your app as an AAB (Android App Bundle) to the Google Play Console, set up a test track, and invite users via email or a shareable link. Testers can install the app through the Play Store, and you can collect feedback and crash reports directly from the Google Play Console.

TestFlight is another option to distribute your app to iOS devices. TestFlight also requires a paid Apple Developer account. TestFlight's internal testing option allows you to create test groups that include up to 100 members of your Apple Developer account team, who then download the app through the TestFlight app. Some teams prefer TestFlight because it doesn't require a new build to add new testers, and apps stay updated automatically.

TestFlight also includes an external testing option that allows you to share your app with up to 10,000 users via an email or a public link.

Both internal and external test distribution in TestFlight require you to [upload your app](/submit/ios) to App Store Connect and wait for the automated review before you can share a build. However, external test builds will need to go through a more formal App Store review (which is distinct from the review that your app must undergo before production release) before being distributed.

## Internal distribution with EAS Build

[Internal distribution](/build/internal-distribution/) is a feature provided by EAS that allows developers to create builds and easily share them with a URL. The URL can be opened on a device to install the app. The app is provided as an installable APK for Android or an ad hoc provisioned app for iOS.

As soon as an internal distribution build is created, it is available for download and installation &mdash; no need to fill out any forms or wait for approval/processing. You can use internal distribution to share both release and development builds.

## Development builds and EAS Update

You can use [development builds](/develop/development-builds/introduction/) to load previews of your app during the review stage by publishing an update with [EAS Update](/eas-update/introduction/). After sharing a development build through internal distribution and installing it, you can launch any update that you published with EAS Update, as long as it is compatible with the installed build. Learn more about [Runtime versions and updates](/eas-update/runtime-versions/).

This approach is uniquely powerful because it allows you to respond to feedback as quickly as you can run `eas update`. It can take seconds to share a new version of your app with your team, and you can do so without needing to rebuild the app or upload it to a store test track.

<BoxLink
  title="Get started with EAS Update"
  description={
    <>
      Learn how to get started using expo-updates library and use EAS Update in your
      project.
    </>
  }
  href="/eas-update/getting-started/"
  Icon={LayersTwo02Icon}
/>

<BoxLink
  title={
    <>
      Use expo-dev-client with EAS Update
    </>
  }
  description={
    <>
      Learn how to use expo-dev-client in your project to launch different app versions
      and preview a published update inside a development build.
    </>
  }
  href="/eas-update/expo-dev-client/"
  Icon={LayersTwo02Icon}
/>