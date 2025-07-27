---
title: Trigger builds from a GitHub repository
sidebar_title: Builds from GitHub
description: Learn about the process of triggering builds from a GitHub repository.
hasVideoLink: true
---

[Expo GitHub App](/build/building-from-github/) automatically triggers builds from our GitHub projects with EAS. We can trigger builds for any build profile based on our development team's preferences. It also allows triggering builds for `git` push committed directly to a repository or a pull request.

In this chapter, we'll configure this functionality. We already have a GitHub repository for our example app to demonstrate this.

---

## Configure Expo GitHub app

To use this functionality, we need to connect our GitHub account:

- In the EAS dashboard, go to [expo.dev/settings](https://expo.dev/settings#connections), and under **Connections** > **GitHub**, click **Connect**. This opens the **Connect GitHub** accounts page.
- Click the **Get started** button which opens a popup to authorize the Expo GitHub app. Click **Install and Authorize**.
- Once the app is installed on our GitHub account, we need to link it to our Expo account. In the next popup, click **Link installation**.
- Once the account is linked, it will show under **GitHub**.

## Connect the GitHub repository

To enable triggering builds from a GitHub repository, we need to connect it to our project in the EAS dashboard:

- In EAS dashboard, go to **Projects** > Select your project > **Project settings** > **GitHub**.
- Under **Connect a GitHub repository**, we'll see a list of our GitHub repos. We need to connect the right one. In the example, we're searching for our repo **sticker-smash.**
- Click **Connect** for the project repository.

## Use default repository settings

The Expo GitHub app needs to know where to find the source code of our project. By default, it selects the root directory using `/`. In our example project, the source code is also available in the root repository. We can leave this to default in the EAS dashboard.

## Trigger a build using a GitHub PR label

The Expo GitHub app provides us [multiple options](/build/building-from-github/#trigger-a-build-from-github) to trigger a build, such as:

- Manually from the Builds page for a specific platform
- Automatically when new code is pushed to the repository
- Automatically using GitHub PR labels

To automatically trigger a build using a GitHub PR label, we're going to utilize the third option from the list above:

- We need to specify the build image that we will be using. Open **eas.json**, and under the `development` profile, add [`android.image`](/eas/json/#image) and [`ios.image`](/eas/json/#image-1) properties and set their value to [`latest`](/build-reference/infrastructure/#configuring-build-environment).

  ```json eas.json
  {
    "build": {
      "development": {
        /* @hide ... */ /* @end */
        /* @info */
        "android": {
          "image": "latest"
        },
        "ios": {
          "image": "latest"
        }
        /* @end */
      }
    }
    /* @hide ... */ /* @end */
  }
  ```

- Next, let's create a new branch called `dev`, and make a change in our app's JavaScript code. Then, commit the change, push the branch, and create a PR from that branch.
- In the PR link, under **Labels**, create a label called `eas-build-all:development`.

- Click **Create pull request** button to create the PR. The Expo GitHub app will start the process of creating a development build.

- In the EAS dashboard, on the **Builds** page, we can verify that the builds for both Android and iOS are triggered.

- If we check the details of an individual build, we can see under **Created by** that the build is created by the GitHub app.

## Summary