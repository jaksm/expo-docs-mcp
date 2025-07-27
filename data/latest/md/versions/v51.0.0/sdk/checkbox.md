---
title: Checkbox
description: A universal React component that provides basic checkbox functionality.
sourceCodeUrl: https://github.com/expo/expo/tree/sdk-51/packages/expo-checkbox
packageName: expo-checkbox
platforms: ["android", "ios", "web"]
---

`expo-checkbox` provides a basic `boolean` input element for all platforms.

## Installation

## Usage

```tsx

  const [isChecked, setChecked] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        
        <Text style={styles.paragraph}>Normal checkbox</Text>
      </View>
      <View style={styles.section}>
        
        <Text style={styles.paragraph}>Custom colored checkbox</Text>
      </View>
      <View style={styles.section}>
        
        <Text style={styles.paragraph}>Disabled checkbox</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 16,
    marginVertical: 32,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paragraph: {
    fontSize: 15,
  },
  checkbox: {
    margin: 8,
  },
});
```

## API

```js

```