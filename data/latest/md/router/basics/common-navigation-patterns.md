---
title: Common navigation patterns in Expo Router
description: Apply Expo Router basics to real-life navigation patterns you could use in your app.
sidebar_title: Common patterns
searchRank: 8
---

Now that you know the basics of how files and directories are named and arranged in Expo Router, let's apply that knowledge, looking at some real-life navigation patterns you might use in your app.

## Stacks inside tabs: nested navigators

If the typical starting point for your app is a set of tabs, but one or more tabs may have more than one screen associated with it, nesting a stack navigator inside of a tab is often the way to go. This pattern often results in intuitive URLs and scales well to desktop web apps, where the primary tabs are often always visible.

Consider the following navigation tree:

In the **app/(tabs)/\_layout.tsx** file, return a `Tabs` component:

{/* prettier-ignore */}
```tsx app/(tabs)/_layout.tsx

  return (
    /* @info Each navigator adds it's own header, so you will likely want to hide the header in the outer navigator. */
    
    /* @end */
      
      
      
    
  );
}
```

In the **app/(tabs)/feed/\_layout.tsx** file, return a `Stack` component:

```tsx app/(tabs)/feed/_layout.tsx

/* @info Setting initialRouteName ensures that direct links deep into the stack still push the index route onto the stack first. */

  initialRouteName: 'index',
};
/* @end */

  return ;
}
```

Now, within the **app/(tabs)/feed** directory, you can have `Link` components that point to different posts (for example, `/feed/123`). Those links will push the `feed/[postId]` route onto the stack, leaving the tab navigator visible.

You can also navigate from any other tab to a post in the feed tab with the same URL. Use `withAnchor` in conjunction with `initialRouteName` to ensure that the `feed/index` route is always the first screen in the stack:

```tsx app/(tabs)/feed/index.tsx

  Go to post

```

You can also nest tabs inside of an outer stack navigator. That is often more useful for displaying modals over the tabs.

## One screen, two tabs: sharing routes

Route groups can be used to share a single screen between two different tabs. Consider a navigation tree that has a Feed tab and a Search tab, and they both share pages for viewing a user profile:

Each of the tabs is put in a group so you can define a third directory that shares routes between two groups (**app/(tabs)/(feed,search)/**). Even with the extra layer, **app/(tabs)/(feed)/index.tsx** is still the nearest index, so it will be the default route.

```tsx app/(tabs)/_layout.tsx

  return (
    
      
      
    
  );
}
```

Both the `(feed)` and `(search)` route groups contain stacks, so they can also share a single layout:

```tsx app/(tabs)/(feed,search)/_layout.tsx

  return ;
}
```

It's also possible for shared groups to only contain the shared pages, with each distinct group having its own layout file.

Now, both tabs can navigate to `/users/evanbacon` and see the same user profile page.

When you're already focused on a tab and navigating to a user, you will stay in that current tab's group. But when deep-linking directly to a user profile page from outside the app, Expo Router has to pick one of the two groups, so it will pick the first group alphabetically. Therefore, deep-linking to `/users/evanbacon` will show the user profile in the Feed tab.

## Authenticated users only: protected routes

For mobile apps requiring authentication, you will likely have a set of routes that should only be accessible to authenticated users.

For example, consider the following navigation tree in which you have a bottom tabs layout, a sign-in page, a create account page, and a modal that should only be visible to authenticated users:

<FileTree
  files={[
    ['app/_layout.tsx', 'Root layout'],
    ['app/(tabs)/_layout.tsx'],
    [
      'app/(tabs)/index.tsx',
      <span>
        Protected 
      </span>,
    ],
    [
      'app/(tabs)/settings.tsx',
      <span>
        Protected 
      </span>,
    ],
    ['app/sign-in.tsx'],
    ['app/create-account.tsx'],
    [
      'app/modal.tsx',
      <span>
        Protected 
      </span>,
    ],
  ]}
/>

When your app is first launched, the router will try to open the root index, **app/(tabs)/index.tsx**. If you wrap this screen in a `Stack.Protected` with the `guard={false}`, the screen will become inaccessible and the next available screen will be opened instead. In this example, the `sign-in` screen will be opened, since it is the next available route.

```tsx app/_layout.tsx

  const { isLoggedIn } = useAuthState();

  return (
    
      <Stack.Protected guard={isLoggedIn}>
        
        
      </Stack.Protected>

      <Stack.Protected guard={!isLoggedIn}>
        
        
      </Stack.Protected>
    
  );
}
```

This way, you can fetch your auth state from a store and show the appropriate screens. If the auth state changes, the layout will re-render, so if `isLoggedIn` changes from `false` to `true`, the app will automatically navigate to the root of the `(tabs)` group.

Another benefit of protected routes is that they are checked even if you deep link into a page directly. For example, if an unauthenticated user deep links into the modal screen above, they will be redirected to the sign-in page.

Protected routes can also be used to conditionally show bottom tabs. In this example, the `vip` tab will only be shown to authenticated users who are VIP members:

```tsx app/(tabs)/_layout.tsx

  const { isVip } = useAuthState();

  return (
    
      

      <Tabs.Protected guard={isVip}>
        
      </Tabs.Protected>

      
    
  );
}
```

## Sometimes the best route isn't a route at all

Separating your navigation states into distinct routes is meant to serve you and your app. Sometimes the best pattern for the job will not involve navigating to another route at all. Since layout files are just React components, you can use them to display all sorts of UI around, besides, or instead of a navigator.

Thinking back to authentication, the protected route setup works great if the user should simply not be able to visit certain pages without logging in. But what about when unauthenticated users can browse an app in read-only mode? In that case, you might want to show a login modal over the app, rather than redirecting the user to a login page:

```tsx app/(logged-in)/_layout.tsx

  const isAuthenticated = /* check for valid auth token / session */

  return (
    
      
      <Modal visible={!isAuthenticated}>{/* login UX */}</Modal>
    
  );
}
```