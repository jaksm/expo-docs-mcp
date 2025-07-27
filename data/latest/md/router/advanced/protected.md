---
title: Protected routes
description: Learn how to make screens inaccessible to client-side navigation.
hasVideoLink: true
---

> **warning** Protected routes are available in SDK 53 and above.

## Overview

Protected screens allow you to prevent users from accessing certain routes using client-side navigation. If a user tries to navigate to a protected screen, or if a screen becomes protected while it is active, they will be redirected to the anchor route (usually the index screen) or the first available screen in the stack.

```tsx app/_layout.tsx

const isLoggedIn = false;

  return (
    
      <Stack.Protected guard={!isLoggedIn}>
        
      </Stack.Protected>

      <Stack.Protected guard={isLoggedIn}>
        
      </Stack.Protected>
      {/* Expo Router includes all routes by default. Adding Stack.Protected creates exceptions for these screens. */}
    
  );
}
```

In this example, the `/private` route is inaccessible because the `guard` is false. When a user attempts to access `/private`, they are redirected to the anchor route, which is the **index** screen.

Additionally, if the user is on `/private/page` and the `guard` condition changes to **false**, they will be redirected automatically.

When a screen's **guard** is changed from **true** to **false**, all it's history entries will be removed from the navigation history.

## Multiple protected screens

In Expo Router, a screen can **only exist in one active route group at a time**.

You should only declare a screen only once, in the most appropriate group or stack. If a screen's availability depends on logic, wrap it in a conditional group instead of duplicating the screen.

```tsx app/_layout.tsx

const isLoggedIn = true;
const isAdmin = true;

  return (
    
      <Stack.Protected guard={true}>
        
      </Stack.Protected>
       // ❌ Not allowed: duplicate screen
    
  );
}
```

## Nesting protected screens

Protected screens can be nested to define hierarchical access control logic.

```tsx app/_layout.tsx

const isLoggedIn = true;
const isAdmin = true;

  return (
    
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Protected guard={isAdmin}>
          
        </Stack.Protected>

        
      </Stack.Protected>
    
  );
}
```

In this case:

- `/private` is only protected if the user is logged in and is an admin.
- `/about` is protected to any logged-in user.

## Falling back to a specific screen

You can configure the navigator to fall back to a specific screen if access is denied.

```tsx app/_layout.tsx

const isLoggedIn = false;

  return (
    
      <Stack.Protected guard={isLoggedIn}>
        
        
      </Stack.Protected>

      
    
  );
}
```

Here, because the **index** screen is protected and the **protected** is **false**, the router redirects to the first available screen &mdash; **login**.

## Tabs and Drawer

Protected routes are also available for [Tabs](/router/advanced/tabs/) and [Drawer](/router/advanced/drawer/) navigators.

```tsx app/_layout.tsx

const isLoggedIn = false;

  return (
    
      
      <Tabs.Protected guard={isLoggedIn}>
        
        
      </Tabs.Protected>

      <Tabs.Protected guard={!isLoggedIn}>
        
      </Tabs.Protected>
    
  );
}
```

## Custom navigators

`Protected` is also available for [custom navigators](/router/migrate/from-react-navigation/#rewrite-custom-navigators) using the `withLayoutContext` hook.

## Static rendering considerations

Protected screens are evaluated on the client side only. During static site generation, no HTML files are created for protected routes. However, if users know the URLs of these routes, they can still request the corresponding HTML or JavaScript files directly. Protected screens are not a replacement for server-side authentication or access control.