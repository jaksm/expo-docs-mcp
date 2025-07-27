---
title: Router settings
description: Learn how to configure layouts with static properties in Expo Router.
sidebar_title: Settings
hideTOC: true
---

> **warning** **Warning:** `unstable_settings` currently do not work with [async routes](/router/reference/async-routes/) (development-only). This is why the feature is designated _unstable_.

When deep linking to a route, you may want to provide a user with a "back" button. The `initialRouteName` sets the default screen of the stack and should match a valid filename (without the extension).

```tsx app/_layout.tsx

  // Ensure any route can link back to `/`
  initialRouteName: 'index',
};

  return ;
}
```

Now deep linking directly to `/other` or reloading the page will continue to show the back arrow.

When using [array syntax](/router/advanced/shared-routes/#arrays) `(foo,bar)` you can specify the name of a group in the `unstable_settings` object to target a particular segment.

```tsx other.tsx

  // Used for `(foo)`
  initialRouteName: 'first',
  // Used for `(bar)`
  bar: {
    initialRouteName: 'second',
  },
};
```

The `initialRouteName` is only used when deep-linking to a route. During app navigation, the route you are navigating to will be the initial route. You can disable this behavior using the `initial` prop on the `` component or by passing the option to the imperative APIs.

```js
// If this navigates to a new _layout, don't override the initial route
;

router.push('/route', { overrideInitialScreen: false });
```