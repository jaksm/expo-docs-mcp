---
title: Create a production build for Android
sidebar_title: Android production build
description: Learn about the process of creating a production build for Android and automating the release process.
---

In this chapter, we'll create our example app's production version and submit it to the Google Play Store. We'll also explore how to automate the creation and release of new app versions.

---

## Prerequisites

To publish and distribute an app on the Google Play Store, we need:

- **Google Play Developer Account:** Must have a paid developer account. For details on setting one up, visit the [Google Play sign-up page](https://play.google.com/apps/publish/signup/).
- **Google Service Account key:** We'll need a Google Service Account email and JSON key to automate the app submission process. **Follow the detailed instructions in our guide on [creating a Google Service Account key or downloading it from an existing account ](https://expo.fyi/creating-google-service-account), then return to this guide.** This is optional but required for [automating the release process](#automated-release).
- **Production build profile:** Ensure that a `production` build profile is present in your **eas.json**, which is added by default.

## Production build for Android

A [production Android build](/build/eas-json/#production-builds) has a **.aab** format which is optimized for distribution on the Google Play Store. Unlike **.apk** builds, **.aab** files can only be distributed and installed through the Google Play Store.

## Create a production build

To create an Android production build using the default `production` profile, open your terminal and execute the following command. Since `production` is set as the default profile in the EAS configuration, there is no need to specify it explicitly with the `--profile` flag.

The above command will queue the build. Notice in the EAS dashboard that the **Version Code** is auto-incremented.

## Create an app on the Google Play Console

To upload the app to the Google Play Store for the first time, we need to:

- Go to the Google Play dashboard.
- On the **Home** page, click **Create app** to make a new app.

- Fill out our app details and click the **Create app** button.

## Release an internal testing version

After the app is created on Google Play Console, it redirects us to the app's Dashboard screen. We need to prepare an internal test version of our app.

- Click **Start testing now** on the **Dashboard**.

- Create an email list of users under **Internal Testing** > **Testers for the internal testing release**.

- Google Play Console prompts us to create a **Release**.
- To create a new release, go to **Releases** and click **Create new release**.

- To store the signing key, go to **App integrity** > **App bundles** and click **Choose signing key** > **Use Google-generated key**.

## Upload the app binary

After EAS has created a production build:

- Open the EAS dashboard and click on **Download** to get the **.aab** file.

- Return to the Google Play Console and go to **App bundles**. Click on **Upload** to add the **.aab**.
- Provide the release details for our app and click on **Next**.
- On the following screen, click on **Save and publish**.

## Share the internal release version

Under **Track Summary**, we see that the latest release shows a temporary app name. This is because our app is not reviewed yet.

Under **Releases**, we see that the app is available to internal testers. To share the app with a team of testers:

- Open the Internal testing dashboard, then click on **View release details**.
- Click on **copy link** under **How testers join your test**.

- On the device, open the test email and follow the steps to download the app.

- The testing email holder needs to accept the invite, and once accepted, the app can be installed on the device.

> **info** **Tip**: To publish an app on the Play Store, in the Google Dashboard, finish the steps under **Set up your app**. These steps are required before releasing the app on the Play Store for the first time. You'll have to provide details like a link to a privacy policy, a target audience, data safety and so on.

> **Complete app store listing**: To prepare the app for store listing, see [Create app store assets](/guides/store-assets/) on how to create screenshots and previews.

<Collapsible summary="Promoting a testing release">

To promote our internal test release version to **alpha**, in Google Play Store Console:

- Go to internal testing and click **Promote release**.
- Open the dropdown menu and click **Closes testing** > **Closed testing - Alpha**.

</Collapsible>

## Add Google Service Account permissions key

> **info** **Tip**: Before following the steps in this section, see the instructions on [creating a Google Service Account key or downloading it from an existing account ](https://expo.fyi/creating-google-service-account) guide.

From now on, we can use [EAS Submit](/submit/introduction/) to automate releases and avoid the manual process. To do that, we need to add the service account key to our project's **eas.json**.

After following the Google Service Account guide steps, we can use the downloaded JSON key:

- Open our project and copy the JSON file from the Google Service Account to the project's root directory.
- To secure sensitive data, ensure this file is excluded from version control by listing it in our **.gitignore**.

## Internal release

Let's add the path to the Google Service Account file path in **eas.json**.

- Under `submit.production` profile, add `android.serviceAccountKeyPath` and the relative file path as its value:

{/* prettier-ignore */}
```json
{
  /* @hide ... */ /* @end */
  "submit": {
    "production": {
      /* @info Add the path to the Google Service Account file and set <CODE>track</CODE> to <CODE>internal</CODE> */
      "android": {
        "serviceAccountKeyPath": "./service-account-file.json",
        "track": "internal"
      }
      /* @end */
    }
  }
}
```

In the above snippet, we're also adding [`track`](/eas/json/#track) property and setting its value to `internal`. This will enable the `eas submit` command to upload our production build and release it for internal testing on the Google Play Store.

- Now run the `eas submit` command to release a new internal testing version:

- This command will automatically create a new internal release version in Google Play Console:

## Production release

To release the app for production:

- Change the value for `track` to `production` in **eas.json**:

```json
{
  /* @hide ... */ /* @end */
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "./service-account-file.json",
        /* @info Change the track to production */
        "track": "production"
        /* @end */
      }
    }
  }
}
```

- We can also use the same EAS Build we did for the internal testing release. Run the `eas submit` command to release to the Play Store:

- To create a track and submit our app to the Google Play Store's review process, we need to **Release** > **Production** and under **Releases**, select the build we want to send for review.

## Automated release

For subsequent releases in future, we can streamline the process by combining build creation and Play Store submission into a single step by using the [`--auto-submit`](/build/automate-submissions/) flag with `eas build`:

## Summary

<ProgressTracker
  currentChapterIndex={7}
  name="EAS_TUTORIAL"
  summary={
    <>
      We successfully created a production-ready Android build, discussed manual and automated
      uploading to Google Play Store using eas submit, and automated the release
      process with the --auto-submit.
    </>
  }
  nextChapterDescription="
In the next chapter, learn about the process of creating a production build for iOS."
  nextChapterTitle="Create a production build for iOS"
  nextChapterLink="/tutorial/eas/ios-production-build/"
/>