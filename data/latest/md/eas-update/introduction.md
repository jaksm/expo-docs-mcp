---
title: EAS Update
sidebar_title: Introduction
description: An introduction to EAS Update which is a hosted service for projects using the expo-updates library.
searchRank: 99
searchPosition: 2
---

**EAS Update** is a hosted service that serves updates for projects using the [`expo-updates`](/versions/latest/sdk/updates) library.

EAS Update makes fixing small bugs and pushing quick fixes a snap in between app store submissions. It accomplishes this by enabling an app to update its own non-native pieces (such as JS, styling, and images) over-the-air.

All apps that include the `expo-updates` library have the ability to receive updates.

- To start using EAS Update, continue to the [Getting Started](/eas-update/getting-started) guide.
- For a complete tutorial of using EAS Update with other EAS services, refer to the [EAS Tutorial](/tutorial/eas/introduction/).

## JS API for update management

The updates [JavaScript API](/versions/latest/sdk/updates/) includes a React hook called `useUpdates()`. This hook provides detailed information about the currently running update and any new updates that are available or have been downloaded. In addition, you can view any errors that were encountered during the update process to help you debug any issues while the app is attempting to update.

The API also provides methods such as `checkForUpdateAsync()` and `fetchUpdateAsync()` which allows you to control when your app checks for and downloads updates.

## Insight tracking

You'll get a [deployments dashboard](https://expo.dev/accounts/[account]/projects/[project]/deployments) that helps visualize which updates are being sent to builds. Updates work in concert with [insights](/eas-insights/introduction/) to provide data on the adoption rates of your updates with your users.

## Republish for reverting mistakes

If an update isn't performing as expected, you can [republish](/eas-update/eas-cli/#republish-a-previous-update-within-a-branch) a previous, stable version on top of the problematic one, much like a new "commit" in version control systems.

## Get started