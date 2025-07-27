---
title: react-native-pager-view
description: A component library that provides a carousel-like view to swipe through pages of content.
sourceCodeUrl: https://github.com/callstack/react-native-pager-view
packageName: react-native-pager-view
platforms: ["android", "ios"]
inExpoGo: true
---

`react-native-pager-view` exposes a component that provides the layout and gestures to scroll between pages of content, like a carousel.

## Installation

## Example

```jsx App.js

  return (
    
      <PagerView style={styles.container} initialPage={0}>
        <View style={styles.page} key="1">
          <Text>First page</Text>
          <Text>Swipe ➡️</Text>
        
        
          <Text>Second page</Text>
        
        
          <Text>Third page</Text>
        
      </PagerView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  page: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

## Learn more