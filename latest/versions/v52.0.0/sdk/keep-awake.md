---
title: KeepAwake
description: A React component that prevents the screen from sleeping when rendered.
sourceCodeUrl: https://github.com/expo/expo/tree/sdk-52/packages/expo-keep-awake
packageName: expo-keep-awake
iconUrl: /static/images/packages/expo-keep-awake.png
platforms: ["android", "ios", "tvos", "web"]
---

`expo-keep-awake` provides a React hook that prevents the screen from sleeping and a pair of functions to enable this behavior imperatively.

## Installation

## Usage

### Example: hook

```jsx

  /* @info As long as this component is mounted, the screen will not turn off from being idle. */
  useKeepAwake();
  /* @end */
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>This screen will never sleep!</Text>
    </View>
  );
}
```

### Example: functions

```jsx

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        
        
      </View>
    );
  }

  _activate = () => {
    /* @info Screen will remain on after called until <strong>deactivateKeepAwake()</strong> is called. */ activateKeepAwake(); /* @end */
    alert('Activated!');
  };

  _deactivate = () => {
    /* @info Deactivates KeepAwake, or does nothing if it was never activated. */ deactivateKeepAwake(); /* @end */
    alert('Deactivated!');
  };
}
```

## API

```js

```