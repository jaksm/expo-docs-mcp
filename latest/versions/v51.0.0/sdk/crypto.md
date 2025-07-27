---
title: Crypto
description: A universal library for crypto operations.
sourceCodeUrl: https://github.com/expo/expo/tree/sdk-51/packages/expo-crypto
packageName: expo-crypto
iconUrl: /static/images/packages/expo-crypto.png
platforms: ["android", "ios", "tvos", "web"]
---

`expo-crypto` enables you to hash data in an equivalent manner to the Node.js core `crypto` API.

## Installation

## Usage

```jsx

  useEffect(() => {
    (async () => {
      const digest = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        'GitHub stars are neat 🌟'
      );
      console.log('Digest: ', digest);
      /* Some crypto operation... */
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Crypto Module Example</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

## API

```js

```

## Error codes

| Code                     | Description                                                                                  |
| ------------------------ | -------------------------------------------------------------------------------------------- |
| `ERR_CRYPTO_UNAVAILABLE` | **Web Only.** Access to the WebCrypto API is restricted to secure origins (localhost/https). |
| `ERR_CRYPTO_DIGEST`      | An invalid encoding type provided.                                                           |