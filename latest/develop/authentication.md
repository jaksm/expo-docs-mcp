---
title: Authentication
description: Learn about setting up authentication in your Expo project.
hideTOC: true
---

Expo can be used to login to many popular providers on Android, iOS, and web. [`expo-auth-session`](/versions/latest/sdk/auth-session/) package allows [browser-based authentication](/versions/latest/sdk/auth-session/#how-web-browser-based-authentication-flows-work) (using OAuth or OpenID Connect) to your project for Android, iOS, and the web. You can also implement authentication using native libraries for third-party providers with [development builds](/develop/development-builds/create-a-build).

<BoxLink
  title="AuthSession API"
  description={
    <>
      expo-auth-session is the easiest way to add web browser-based authentication (for
      example, browser-based OAuth flows) to your app.
    </>
  }
  href="/versions/latest/sdk/auth-session"
  Icon={BookOpen02Icon}
/>

<BoxLink
  title="Google authentication"
  description={
    <>
      A guide on using @react-native-google-signin/google-signin library to integrate
      Google authentication in your Expo project.
    </>
  }
  href="/guides/google-authentication"
  Icon={BookOpen02Icon}

/>

<BoxLink
  title="Facebook authentication"
  description={
    <>
      A guide on using react-native-fbsdk-next library to integrate Facebook
      authentication in your Expo project.
    </>
  }
  href="/guides/facebook-authentication"
  Icon={BookOpen02Icon}
/>

<BoxLink
  title="Apple Authentication"
  description={
    <>
      expo-apple-authentication provides Apple authentication for iOS 13 and higher.
    </>
  }
  href="/versions/latest/sdk/apple-authentication"
  Icon={BookOpen02Icon}
/>