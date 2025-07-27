---
title: Tutorial: Create a native view
sidebar_title: Create a native view
description: A tutorial on creating a native view that renders a WebView with Expo Modules API.
---

In this tutorial, you'll build an example module with a native view that renders a WebView. For Android, you'll use the [`WebView`](https://developer.android.com/reference/android/webkit/WebView) component, and for iOS, [`WKWebView`](https://developer.apple.com/documentation/webkit/wkwebview). Web support can be implemented using an [`iframe`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe) and is left as an exercise for you.

## Initialize a new module

Create a new module by running the following command and name the example module `expo-web-view`:

> **info** Since this is an example library and won't be published, press <kbd>return</kbd> for all prompts to accept the default values.

## Set up workspace

Clean up the default module to start with a clean slate by deleting the following files:

Locate the following files and replace them with the provided minimal boilerplate:

```kotlin android/src/main/java/expo/modules/webview/ExpoWebViewModule.kt
package expo.modules.webview

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ExpoWebViewModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ExpoWebView")

    View(ExpoWebView::class) {}
  }
}
```

```swift ios/ExpoWebViewModule.swift
import ExpoModulesCore

public class ExpoWebViewModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ExpoWebView")

    View(ExpoWebView.self) {}
  }
}
```

```tsx src/ExpoWebView.tsx

const NativeView: React.ComponentType<Props> = requireNativeViewManager('ExpoWebView');

  return ;
}
```

```tsx src/index.ts

```

```tsx example/App.tsx

  return ;
}
```

## Run the example project

To ensure everything is working, start the TypeScript compiler to watch for changes and rebuild the module's JavaScript:

You should now see a blank purple screen. While it's not very exciting, it's a good start. Next, turn it into a WebView.

## Add the system WebView as a subview

Add the system `WebView` with a hardcoded URL as a subview of `ExpoWebView`. The `ExpoWebView` class extends `ExpoView`, which extends `RCTView` from React Native, and eventually extends `View` on Android and `UIView` on iOS.

Ensure that the `WebView` subview uses the same layout as `ExpoWebView`, whose layout is calculated by React Native's layout engine.

### Android view

On Android, use `LayoutParams` to set the WebView's layout to match the `ExpoWebView` layout. You can do this when you instantiate the WebView.

```kotlin android/src/main/java/expo/modules/webview/ExpoWebView.kt
package expo.modules.webview

import android.content.Context
import android.webkit.WebView
import android.webkit.WebViewClient
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.views.ExpoView

class ExpoWebView(context: Context, appContext: AppContext) : ExpoView(context, appContext) {
  internal val webView = WebView(context).also {
    it.layoutParams = LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT)
    it.webViewClient = object : WebViewClient() {}
    addView(it)

    it.loadUrl("https://docs.expo.dev/modules/")
  }
}
```

### iOS view

On iOS, set `clipsToBounds` to `true` and ensure the WebView's `frame` matches the bounds of `ExpoWebView` in `layoutSubviews`. The `init` method is called when the view is created, and `layoutSubviews` is called when the layout changes.

```swift ios/ExpoWebView.swift
import ExpoModulesCore
import WebKit

class ExpoWebView: ExpoView {
  let webView = WKWebView()

  required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)
    clipsToBounds = true
    addSubview(webView)

    let url =  URL(string:"https://docs.expo.dev/modules/")!
    let urlRequest = URLRequest(url:url)
    webView.load(urlRequest)
  }

  override func layoutSubviews() {
    webView.frame = bounds
  }
}
```

### Example app

No changes are required. Rebuild and run the app using the following commands:

After that, you'll see the [Expo Modules API overview page](/modules/overview) rendered. If the changes aren't reflected, try reinstalling the app.

## Add a prop to set the URL

To set a prop on the view, define the prop name and setter inside `ExpoWebViewModule`. In this case, you can access the `webView` property directly for convenience. However, in real-world scenarios, keep the logic inside the `ExpoWebView` class to minimize how much `ExpoWebViewModule` knows about its internals.

Use the [Prop definition component](/modules/module-api/#prop) to define the prop. In the prop setter block, you can access both the view and the prop. Specify that the URL is of type `URL` &mdash; the Expo modules API will convert strings to the native `URL` type.

### Android module

```kotlin android/src/main/java/expo/modules/webview/ExpoWebViewModule.kt
package expo.modules.webview

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.net.URL

class ExpoWebViewModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ExpoWebView")

    View(ExpoWebView::class) {
      Prop("url") { view: ExpoWebView, url: URL? ->
        view.webView.loadUrl(url.toString())
      }
    }
  }
}
```

### iOS module

```swift ios/ExpoWebViewModule.swift
import ExpoModulesCore

public class ExpoWebViewModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ExpoWebView")

    View(ExpoWebView.self) {
      Prop("url") { (view, url: URL) in
        if view.webView.url != url {
          let urlRequest = URLRequest(url: url)
          view.webView.load(urlRequest)
        }
      }
    }
  }
}
```

### TypeScript module

Next, add the `url` prop to the `Props` type.

```tsx src/ExpoWebView.tsx

  url?: string;
} & ViewProps;

const NativeView: React.ComponentType<Props> = requireNativeViewManager('ExpoWebView');

  return ;
}
```

### Example app

Finally, pass a `URL` to your `WebView` component in the example app.

```tsx example/App.tsx

  return ;
}
```

Rebuild the example app:

After that, you'll see the [Expo homepage](https://expo.dev) in the WebView.

## Add an event to notify when the page has loaded

[View callbacks](/modules/module-api/#view-callbacks) allow developers to listen for events on components. They are typically registered through props on the component, for example: ``. Use the [Events definition component](/modules/module-api/#events) to define an event for your WebView. Call it `onLoad`.

### Android view and module

On Android, override the `onPageFinished` function. Then, call the `onLoad` event handler that you defined in the module.

```kotlin android/src/main/java/expo/modules/webview/ExpoWebView.kt
package expo.modules.webview

import android.content.Context
import android.webkit.WebView
import android.webkit.WebViewClient
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.viewevent.EventDispatcher
import expo.modules.kotlin.views.ExpoView

class ExpoWebView(context: Context, appContext: AppContext) : ExpoView(context, appContext) {
  private val onLoad by EventDispatcher()

  internal val webView = WebView(context).also {
    it.layoutParams = LayoutParams(
      LayoutParams.MATCH_PARENT,
      LayoutParams.MATCH_PARENT
    )

    it.webViewClient = object : WebViewClient() {
      override fun onPageFinished(view: WebView, url: String) {
        onLoad(mapOf("url" to url))
      }
    }

    addView(it)
  }
}
```

Indicate in `ExpoWebViewModule` that the `View` has an `onLoad` event.

```kotlin android/src/main/java/expo/modules/webview/ExpoWebViewModule.kt
package expo.modules.webview

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.net.URL

class ExpoWebViewModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ExpoWebView")

    View(ExpoWebView::class) {
      Events("onLoad")

      Prop("url") { view: ExpoWebView, url: URL? ->
        view.webView.loadUrl(url.toString())
      }
    }
  }
}
```

### iOS view and module

On iOS, implement `webView(_:didFinish:)` and make `ExpoWebView` extend `WKNavigationDelegate`. Then, call `onLoad` from that delegate method.

```swift ios/ExpoWebView.swift
import ExpoModulesCore
import WebKit

class ExpoWebView: ExpoView, WKNavigationDelegate {
  let webView = WKWebView()
  let onLoad = EventDispatcher()

  required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)
    clipsToBounds = true
    webView.navigationDelegate = self
    addSubview(webView)
  }

  override func layoutSubviews() {
    webView.frame = bounds
  }

  func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
    if let url = webView.url {
      onLoad([
        "url": url.absoluteString
      ])
    }
  }
}
```

Indicate in `ExpoWebViewModule` that the `View` has an `onLoad` event.

```swift ios/ExpoWebViewModule.swift
import ExpoModulesCore

public class ExpoWebViewModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ExpoWebView")

    View(ExpoWebView.self) {
      Events("onLoad")

      Prop("url") { (view, url: URL) in
        if view.webView.url != url {
          let urlRequest = URLRequest(url: url)
          view.webView.load(urlRequest)
        }
      }
    }
  }
}
```

### TypeScript module

Event payloads are included within the `nativeEvent` property of the event. To access the `url` from the `onLoad` event, read `event.nativeEvent.url`.

```tsx src/ExpoWebView.tsx

  url: string;
};

  url?: string;
  onLoad?: (event: { nativeEvent: OnLoadEvent }) => void;
} & ViewProps;

const NativeView: React.ComponentType<Props> = requireNativeViewManager('ExpoWebView');

  return ;
}
```

### Example app

Update the example app to show an alert when the page has loaded. Copy the following code, then rebuild and run your app, and you'll see the alert!

```tsx example/App.tsx

  return (
    <WebView
      style={{ flex: 1 }}
      url="https://expo.dev"
      onLoad={event => alert(`loaded ${event.nativeEvent.url}`)}
    />
  );
}
```

## Bonus: Build a web browser UI around it

Now that you have a WebView, build a web browser UI around it. Try rebuilding a browser UI, and feel free to add new native capabilities as needed (for example, support for back or reload buttons). If you need inspiration, see the example below.

<Collapsible summary="example/App.tsx">

```tsx App.tsx

  const [inputUrl, setInputUrl] = useState('https://docs.expo.dev/modules/');
  const [url, setUrl] = useState(inputUrl);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <View style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? 80 : 30 }}>
      <TextInput
        value={inputUrl}
        onChangeText={setInputUrl}
        returnKeyType="go"
        autoCapitalize="none"
        onSubmitEditing={() => {
          if (inputUrl !== url) {
            setUrl(inputUrl);
            setIsLoading(true);
          }
        }}
        keyboardType="url"
        style={{
          color: '#fff',
          backgroundColor: '#000',
          borderRadius: 10,
          marginHorizontal: 10,
          paddingHorizontal: 20,
          height: 60,
        }}
      />

      <WebView
        url={url.startsWith('https://') || url.startsWith('http://') ? url : `https://${url}`}
        onLoad={() => setIsLoading(false)}
        style={{ flex: 1, marginTop: 20 }}
      />
      
    </View>
  );
}

function LoadingView({ isLoading }: { isLoading: boolean }) {
  if (!isLoading) {
    return null;
  }

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 80,
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
      }}>
      
      <Text style={{ color: '#fff' }}>Loading...</Text>
    </View>
  );
}
```

</Collapsible>

Congratulations! You've created your first Expo module with a native view for Android and iOS.

## Next steps