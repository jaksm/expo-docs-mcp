---
title: Obtain Google Service Account Keys using FCM V1
sidebar_title: Add Android FCM V1 credentials
description: Learn how to create or use a Google Service Account Key for sending Android Notifications using FCM.
---

## Create a new Google Service Account Key

Here are the steps to configure a new Google Service Account Key in EAS for sending Android Notifications using FCM V1.

Create a new Firebase project for your app in the [Firebase Console](https://console.firebase.google.com). If you already have a Firebase project for your app, continue to the next step.

In the Firebase console, open **Project settings** > [**Service accounts**](https://console.firebase.google.com/project/_/settings/serviceaccounts/adminsdk) for your project.

Click **Generate New Private Key**, then confirm by clicking **Generate Key**. Securely store the JSON file containing the private key.

Upload the JSON file to EAS and configure it for sending Android notifications. This can be done using EAS CLI or in [EAS dashboard](https://expo.dev).

<Tabs tabs={["EAS CLI", "expo.dev"]}>

<Tab>

- Run `eas credentials`
- Select `Android` > `production` > `Google Service Account`
- Select `Manage your Google Service Account Key for Push Notifications (FCM V1)`
- Select `Set up a Google Service Account Key for Push Notifications (FCM V1)` > `Upload a new service account key`
- If you've previously stored the JSON file in your project directory, the EAS CLI automatically detects the file and prompts you to select it. Press <kbd>Y</kbd> to continue.

> **Note**: Add the JSON file to your version source control's ignore file (for example, **.gitignore**) to avoid committing it to your repository since it contains sensitive data.

</Tab>

<Tab>

- Under **Project settings**, click [**Credentials**](https://expo.dev/accounts/[account]/projects/[project]/credentials) in the navigation menu
- For **Android**, click **Add Application Identifier** or select an existing **Application identifier**
- Under **Service Credentials** > **FCM V1 service account key**, click **Add a service account key**

- Under **Upload new key**, upload your JSON credential and click **Save**

</Tab>

</Tabs>

Configure the **google-services.json** file in your project. Download it from the Firebase Console and place it at the root of your project directory. If you're using version control, add it to your ignore file (for example, **.gitignore**) as it contains sensitive data.

**Note**: You can skip this step if **google-services.json** has already been set up.

In **app.json**, add [`expo.android.googleServicesFile`](/versions/latest/config/app/#googleservicesfile) with its value as the path of the **google-services.json**.

```json app.json
{
  "expo": {
  /* @hide ...*/ /* @end */
  "android": {
    /* @hide ...*/ /* @end */
    "googleServicesFile": "./path/to/google-services.json"
  }
}
```

You're all set! You can now send notifications to Android devices via Expo Push Notifications using the FCM V1 protocol.

## Use an existing Google Service Account Key

Open the [IAM Admin page](https://console.cloud.google.com/iam-admin/iam?authuser=0) in Google Cloud Console. In the Permissions tab, locate the **Principal** you intend to modify and click the pencil icon for **Edit Principal**.

Click **Add Role** and select the **Firebase Messaging API Admin** role from the dropdown. Click **Save**.

You have to specify to EAS which JSON credential file to use for sending FCM V1 notifications, using EAS CLI or in [EAS dashboard](https://expo.dev). You can upload a new JSON file or select a previously uploaded file.

<Tabs tabs={["EAS CLI", "expo.dev"]}>

<Tab>

- Run `eas credentials`
- Select `Android` > `production` > `Google Service Account`
- Select `Manage your Google Service Account Key for Push Notifications (FCM V1)`
- Select `Set up a Google Service Account Key for Push Notifications (FCM V1)` > `Upload a new service account key`
- The EAS CLI automatically detects the file on your local machine and prompts you to select it. Press <kbd>Y</kbd> to continue.

> **Note**: Add the JSON file to your version source control's ignore file (for example, **.gitignore**) to avoid committing it to your repository since it contains sensitive data.

</Tab>

<Tab>

- Under **Project settings**, click [**Credentials**](https://expo.dev/accounts/[account]/projects/[project]/credentials) in the navigation menu
- For **Android**, click **Add Application Identifier** or select an existing **Application identifier**
- Under **Service Credentials** > **FCM V1 service account key**, click **Add a service account key**

- Under **Upload new key**, upload your JSON credential and click **Save**

</Tab>

</Tabs>

Configure the **google-services.json** file in your project. Download it from the Firebase Console and place it at the root of your project directory. If you're using version control, add it to your ignore file (for example, **.gitignore**) as it contains sensitive data.

**Note**: You can skip this step if **google-services.json** has already been set up.

In **app.json**, add [`expo.android.googleServicesFile`](/versions/latest/config/app/#googleservicesfile) with its value as the path of the **google-services.json**.

```json app.json
{
  "expo": {
    /* @hide ...*/ /* @end */
    "android": {
      /* @hide ...*/ /* @end */ "googleServicesFile": "./path/to/google-services.json"
    }
  }
}
```

You're all set! You can now send notifications to Android devices via Expo Push Notifications using the FCM V1 protocol.