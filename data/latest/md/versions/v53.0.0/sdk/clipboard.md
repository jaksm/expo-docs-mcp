---
title: Clipboard
description: A universal library that allows getting and setting Clipboard content.
sourceCodeUrl: https://github.com/expo/expo/tree/sdk-53/packages/expo-clipboard
packageName: expo-clipboard
iconUrl: /static/images/packages/expo-clipboard.png
platforms: ["android", "ios", "web"]
---

`expo-clipboard` provides an interface for getting and setting Clipboard content on Android, iOS, and Web.

## Installation

## Usage

```jsx

  const [copiedText, setCopiedText] = useState('');

  const copyToClipboard = async () => {
    /* @info Copy the text to the clipboard */
    await Clipboard.setStringAsync('hello world');
    /* @end */
  };

  const fetchCopiedText = async () => {
    const text = /* @info Paste the text from the clipboard */ await Clipboard.getStringAsync();
    /* @end */
    setCopiedText(text);
  };

  return (
    <View style={styles.container}>
      
      
      <Text style={styles.copiedText}>{copiedText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  copiedText: {
    marginTop: 10,
    color: 'red',
  },
});
```

## API

```js

```

> **warning** On Web, this module uses the [`AsyncClipboard` API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API),
> which might behave differently between browsers or not be fully supported.
> Especially on WebKit, there's an issue which makes this API unusable in asynchronous code.
> [Click here for more details](https://bugs.webkit.org/show_bug.cgi?id=222262).