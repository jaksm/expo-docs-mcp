---
title: Navigating between pages in Expo Router
description: Learn the different ways to link to and navigate to pages in Expo Router.
sidebar_title: Navigation
hasVideoLink: true
---

Once you have a few pages in your app and their layouts setup, it's time to start navigating between them. Navigation in Expo Router works a lot like React Navigation, but with all pages having a URL by default, we can create links and use these URLs to move about our app using familiar web patterns.

## Native navigation basics with `useRouter`

Like in React Navigation, you can call a function from an `onPress` handler to navigate to another page. In Expo Router, you can use the `useRouter` hook to access navigation functions:

```tsx

  const router = useRouter();

  return <Button title="Go to About" onPress={() => router.navigate('/about')} />;
}
```

Expo Router apps default to stack navigation, where navigating to a new route pushes a screen onto a stack, and backing out of that route pops it off the stack. Usually, you would want to use the `router.navigate` function. This will either push a new page onto the stack or unwind to an existing route on the stack. However, you can also call `router.push` to explicitly push a new page onto the stack, `router.back` to go back to the previous page, or `router.replace` to replace the current page on the stack.

With Expo Router, you refer to pages by their URL, or their position relative to the **app** directory. Check out the following file structure and how you would navigate to each page:

## Links and buttons

The typical way to link to a page in Expo Router is to use links like web apps. Expo Router has a `Link` component for navigating between pages, where the `href` is the same route you would use in `router.navigate`:

{/* prettier-ignore */}
```tsx app/index.tsx

/* @info Import the Link React component from expo-router. */

/* @end */

  return (
    
      /* @info Tapping this will link to the <strong>about</strong> page. */
      <Link href="/about">About</Link>
      /* @end */
    
  );
}
```

By default, Links can only wrap `Text` components. You can use `Pressable` or other components that support `onPress` and `onClick` props inside a link with the `asChild` prop:

{/* prettier-ignore */}
```tsx

  return (
    /* @info The onPress event that navigates to /other will be passed to Pressable. */
    
    /* @end */
      <Pressable>
        <Text>Home</Text>
      </Pressable>
    
  );
}
```

## Relative routes

You don't always have to use the absolute path to a route. Using paths that start with `./` (for the current directory) or `../` (for the parent directory) will navigate relative to the current route.

A relative URL is a URL prefix with `./`, such as `./article`, or `./article/`. Relative URLs are resolved relative to the current rendered screen.

```tsx
Go to article
```

```ts
router.navigate('./article');
```

## Dynamic routes and URL parameters

Dynamic routes can be linked to with their full URL, or by passing a `params` object.

Consider the following file structure:

Each of these links will navigate to the same page:

{/* prettier-ignore */}
```tsx app/index.tsx
/* @info Import the Link React component and router to navigate imperatively from expo-router. */

/* @end */

  return (
    
      <Link
        href="/user/bacon">
        View user (id inline)
      </Link>
      <Link
        href={{
          pathname: '/user/[id]',
          params: { id: 'bacon' }
        }}
      >
        View user (id in params in href)
      </Link>
      <Pressable
        onPress={() =>
          router.navigate({
            pathname: '/user/[id]',
            params: { id: 'bacon' }
          })
        }
      >
        <Text>View user (imperative)</Text>
      </Pressable>
    
  );
}
```

### Passing query parameters

You can specify query parameters in the link URL itself, or as additional parameters in the `params` object. Any parameters that don't match the name of the dynamic route variable are equivalent to query parameters.

```tsx
View users

  View users

```

### Using dynamic route variables and query parameters in the destination page

All variables in the link URL are accessible to the receiving page via the `useLocalSearchParams` hook. This hook returns an object with all the URL parameters, including those passed as `params`.

For example, if you have a link like this:

```tsx
View users
```

Then you can read the parameters on the other end like this:

```tsx

  const { id, limit } = useLocalSearchParams();

  return (
    
      <Text>User ID: {id}</Text>
      <Text>Limit: {limit}</Text>
    
  );
}
```

### Updating query parameters without navigating

Query parameters can be updated without navigating to a new page. This can be done with a `Link` that uses the same URL as the current page, but with updated query parameters, or imperatively.

```tsx
View more users

 router.setParams({ limit: 50 })}>
  <Text>View more users</Text>

```

## Redirects

You can immediately redirect to another route from a page or layout with the `Redirect` component. This functions like the `replace` imperative navigation function. A redirect will navigate to the new route without rendering the current page.

```tsx

  return ;
}
```

## Prefetching

The `prefetch` prop on a `` component enables prefetching of the target screen when the component is rendered. This allows for faster navigation by preparing the screen in advance.

```tsx

  return ;
}
```

When `prefetch` is set, Expo Router will attempt to render the target screen off-screen. The exact behavior depends on the type of navigator used:

- **Expo Router Navigators**: Render the target screen off-screen to enable preloading.
- **Custom Navigators**: May implement prefetching differently or not support it at all.

When a screen is preloaded in a stack navigator, it will have a few limitations:

- It cannot use the imperative `router` API.
- It cannot update options with `useNavigation().setOptions()`
- It cannot listen to events from the navigator (for example focus, tabPress, and so on).

The navigation object will be updated once you navigate to the screen. So if you have an event listener in a useEffect hook, and have a dependency on navigation, it will add any listeners when the screen is navigated to:

```tsx
const navigation = useNavigation();

useEffect(() => {
  const unsubscribe = navigation.addListener('tabPress', () => {
    // do something
  });

  return () => {
    unsubscribe();
  };
}, [navigation]);
```

Similarly, for dispatching actions or updating options, you can check if the screen is focused before doing so:

```tsx
const navigation = useNavigation();

if (navigation.isFocused()) {
  navigation.setOptions({ title: 'Updated title' });
}
```

For more information, refer to the [React Navigation preload docs](https://reactnavigation.org/docs/navigation-object/#preload)

## Deep links

Deep linking is when a URL opens a specific page in your app. Expo Router supports deep linking by default, so you can link to any page in your app with a URL from outside of your app, as you would inside your app with `Link`. This is especially useful for sharing links to specific pages in your app.

On web, deep linking is as simple as navigating to that specific URL in your web browser. On mobile, you define a `scheme` in your [app config](/workflow/configuration/) file, and this becomes the prefix for deep links into your app.

Assuming your `scheme` is `myapp`, here are some examples of how you would link to a page in your app from a web page or another app:

With app links and universal links, you can also link to your app with an `https` URL. For more information, see [Universal linking](/linking/overview/#universal-linking).

## Initial routes

When opening a deep link to a page in your app, you will likely want back navigation to work as if the user navigated to the page from your home page. To do this, you can specify an `initialRouteName` configuration, which defines the page in a layout that should be loaded before the deep linked page.

Consider the following file structure:

`stack` is a stack navigator, and `/stack/index` is always the first route in the stack.

To ensure that `/stack/index` is always loaded first, even if the user deep links to `/stack/second`, you can set the `initialRouteName` in **app/stack/\_layout.tsx**:

```tsx

  // Ensure any route can link back to `/`
  initialRouteName: 'index',
};
```

By default, the `initialRouteName` is only considered when deep linking and not during navigation within your app. However, you can use the `withAnchor` prop on `Link` to force the initial route to be loaded when navigating directly into another stack inside your app.

So, if **app/index.tsx** contained a link to `/stack/second`, add the `withAnchor` prop to ensure that `/stack/index` is loaded first, which will cause the user to go back to `/stack/index` when they press the back button from `/stack/second`:

```tsx

  Go to second

```

> **info** If you are missing a back button when testing deep links, this can often be fixed by setting an `initialRouteName`.