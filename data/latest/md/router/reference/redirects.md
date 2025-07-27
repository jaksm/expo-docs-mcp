---
title: Redirects
description: Learn how to redirect URLs in Expo Router.
---

You can redirect a request to a different URL based on some in-app criteria. Expo Router supports a number of different redirection patterns.

## Using `Redirect` component

You can immediately redirect from a particular screen by using the `Redirect` component:

```tsx

/* @info */

/* @end */

  /* @info Some logic to determine if the user is logged in. */
  const { user } = useAuth();
  /* @end */

  if (!user) {
    /* @info Redirect to the login screen if the user is not authenticated. */
    return ;
    /* @end */
  }

  return (
    
      <Text>Welcome Back!</Text>
    
  );
}
```

## Using `useRouter` hook

You can also redirect imperatively with the `useRouter` hook:

```tsx

function MyScreen() {
  const router = useRouter();

  useFocusEffect(() => {
    // Call the replace method to redirect to a new route without adding to the history.
    // We do this in a useFocusEffect to ensure the redirect happens every time the screen
    // is focused.
    router.replace('/profile/settings');
  });

  return My Screen;
}
```