---
title: Tabs
description: Learn how to use the Tabs layout in Expo Router.
hasVideoLink: true
---

Tabs are a common way to navigate between different sections of an app. Expo Router provides a tabs layout to help you create a tab bar at the bottom of your app. The fastest way to get started is to use a template. See the [quick start installation](/router/installation/#quick-start) to get started.

Continue reading to add tabs to an existing project or to customize your app's tabs.

## Get started

You can use file-based routing to create a tabs layout. Here's an example file structure:

This file structure produces a layout with a tab bar at the bottom of the screen. The tab bar will have two tabs: **Home** and **Settings**:

You can use the **app/\_layout.tsx** file to define your app's root layout:

```tsx app/_layout.tsx

  return (
    
      
    
  );
}
```

The **(tabs)** directory is a special directory name that tells Expo Router to use the `Tabs` layout.

From the file structure, the **(tabs)** directory has three files. The first is **(tabs)/\_layout.tsx**. This file is the main layout file for the tab bar and each tab. Inside it, you can control how the tab bar and each tab button look and behave.

```tsx app/(tabs)/_layout.tsx

  return (
    
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => ,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => ,
        }}
      />
    
  );
}
```

Finally, you have the two tab files that make up the content of the tabs: **app/(tabs)/index.tsx** and **app/(tabs)/settings.tsx**.

```tsx app/(tabs)/index.tsx & app/(tabs)/settings.tsx

  return (
    
      <Text>Tab [Home|Settings]</Text>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

The tab file named **index.tsx** is the default tab when the app loads. The second tab file **settings.tsx** shows how you can add more tabs to the tab bar.

## Screen options

The tabs layout wraps the [Bottom Tabs Navigator](https://reactnavigation.org/docs/bottom-tab-navigator) from React Navigation. You can use the [options presented in the React Navigation documentation](https://reactnavigation.org/docs/bottom-tab-navigator/#options) to customize the tab bar or each tab.

## Advanced

### Hiding a tab

Sometimes you want a route to exist but not show up in the tab bar. You can pass `href: null` to disable the button:

```tsx app/(tabs)/_layout.tsx

  return (
    
      <Tabs.Screen
        name="index"
        options={{
          /* @info Adding <CODE>href: null</CODE> in this tab's <CODE>options</CODE> will not show this tab in the tab bar.*/
          href: null,
          /* @end */
        }}
      />
    
  );
}
```

### Dynamic routes

You can use a dynamic route in a tab bar. For example, you have a `[user]` tab that shows a user's profile. You can use the `href` option to link to a specific user's profile.

```tsx app/(tabs)/_layout.tsx

  return (
    
      
    
  );
}
```

> **Note**: When adding a dynamic route in your tab layout, ensure that the dynamic route defined is unique. You cannot have two screens for the same dynamic route. For example, you cannot have two `[user]` tabs. If you need to have multiple dynamic routes, create a custom navigator.