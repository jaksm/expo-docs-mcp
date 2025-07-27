---
title: Using LogRocket
maxHeadingDepth: 4
description: A guide on installing and configuring LogRocket for session replays and error monitoring.
---

[LogRocket](https://logrocket.com) records user sessions and identifies bugs as your users use your app. You can filter sessions by update IDs and also connect to your LogRocket account on the EAS dashboard to get quick access to your app's session data.

## Install and configure LogRocket

You can install the LogRocket SDK with the following command:

Then, in your [app config](/workflow/configuration/), include the LogRocket config plugin:

```json app.json
{
  "plugins": [
    [
      "expo-build-properties",
      {
        "android": {
          "minSdkVersion": 25
        }
      }
    ],
    "@logrocket/react-native"
  ]
}
```

Finally, initialize LogRocket in your app in a top-level file, like **app/\_layout.tsx**:

```tsx app/_layout.tsx

const App = () => {
  useEffect(() => {
    LogRocket.init('<App ID>', {
      updateId: Updates.isEmbeddedLaunch ? null : Updates.updateId,
      expoChannel: Updates.channel,
    });
  }, []);
};
```

In the code above, replace `<App ID>` with your [LogRocket App ID](https://app.logrocket.com/r/settings/setup).

## Connecting LogRocket on the EAS dashboard

You can link your LogRocket account and project to your Expo account and project on Expo's dashboard, so that you can see the last few sessions from your app in the deployments and updates dashboards.

Go to your **Account settings** > [**Overview**](https://expo.dev/accounts/%5Baccount%5D/settings) > **Connections** and click **Connect** to authenticate with LogRocket:

Then, go to your project, under **Project settings** > [**General**](https://expo.dev/accounts/%5Baccount%5D/projects/%5BprojectName%5D/settings) and click **Connect** to link your LogRocket project with your project on Expo:

Then, you'll start to see **View on LogRocket** buttons in the EAS dashboard in the Native Deployments and Updates dashboards, along with the last few sessions from your app.

## Learn more about LogRocket

To learn more about how to use LogRocket with Expo, check out the [LogRocket documentation](https://docs.logrocket.com/reference/react-native-expo-adding-the-sdk).