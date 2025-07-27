---
title: react-native-keyboard-controller
description: A library that provides a Keyboard manager that works in an identical way on Android and iOS
sourceCodeUrl: https://github.com/kirillzyusko/react-native-keyboard-controller
packageName: react-native-keyboard-controller
platforms: ["android", "ios"]
inExpoGo: true
isNew: true
---

`react-native-keyboard-controller` offers additional functionality beyond the built-in React Native keyboard APIs, providing consistency across Android and iOS with minimal configuration and offering the native feel users expect.

## Installation

## Usage

```tsx

  return (
    <>
      <KeyboardAwareScrollView bottomOffset={62} contentContainerStyle={styles.container}>
        <View>
          
          
        </View>
        
        <View>
          
          
          
        </View>
        
      </KeyboardAwareScrollView>
      
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    padding: 16,
  },
  listStyle: {
    padding: 16,
    gap: 16,
  },
  textInput: {
    width: 'auto',
    flexGrow: 1,
    flexShrink: 1,
    height: 45,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#d8d8d8',
    backgroundColor: '#fff',
    padding: 8,
    marginBottom: 8,
  },
});
```

## Additional resources