---
title: Nesting navigators
description: Learn how to nest navigators in Expo Router.
hasVideoLink: true
---

> **warning** Navigation UI elements (Link, Tabs, Stack) may move out of the Expo Router library in the future.

Nesting navigators allow rendering a navigator inside the screen of another navigator. This guide is an extension of [React Navigation: Nesting navigators](https://reactnavigation.org/docs/nesting-navigators) to Expo Router. It provides an example of how nesting navigators work when using Expo Router.

## Example

Consider the following file structure which is used as an example:

In the above example, **app/home/feed.tsx** matches `/home/feed`, and **app/home/messages.tsx** matches `/home/messages`.

```tsx app/_layout.tsx

```

Both **app/home/\_layout.tsx** and **app/index.tsx** below are nested in the **app/\_layout.tsx** layout so that it will be rendered as a stack.

```tsx app/home/_layout.tsx

```

```tsx app/index.tsx

  return Navigate to nested route;
}
```

Both **app/home/feed.tsx** and **app/home/messages.tsx** below are nested in the **home/\_layout.tsx** layout, so it will be rendered as a tab.

```tsx app/home/feed.tsx

  return (
    
      <Text>Feed screen</Text>
    
  );
}
```

```tsx app/home/messages.tsx

  return (
    
      <Text>Messages screen</Text>
    
  );
}
```

## Navigate to a screen in a nested navigator

In React Navigation, navigating to a specific nested screen can be controlled by passing the screen name in params. This renders the specified nested screen instead of the initial screen for that nested navigator.

For example, from the initial screen inside the `root` navigator, you want to navigate to a screen called `media` inside `settings` (a nested navigator). In React Navigation, this is done as shown in the example below:

```jsx React Navigation
navigation.navigate('root', {
  screen: 'settings',
  params: {
    screen: 'media',
  },
});
```

In Expo Router, you can use `router.push()` to achieve the same result. There is no need to pass the screen name in the params explicitly.

```jsx Expo Router
router.push('/root/settings/media');
```