---
title: Store data
description: Learn about different libraries available to store data in your Expo project.
---

Storing data can be essential to the features implemented in your mobile app. There are different ways to save data in your Expo project depending on the type of data you want to store and the security requirements of your app. This page lists a variety of libraries to help you decide which solution is best for your project.

## Expo SecureStore

`expo-secure-store` provides a way to encrypt and securely store key-value pairs locally on the device.

## Expo FileSystem

`expo-file-system` provides access to a file system stored locally on the device. Within Expo Go, each project has a separate file system and no access to other Expo projects' files. However, it can save content shared by other projects to the local filesystem and share local files with other projects. It is also capable of uploading and downloading files from network URLs.

## Expo SQLite

`expo-sqlite` package gives your app access to a database that can be queried through a WebSQL-like API. The database is persisted across restarts of your app. You can use it for importing an existing database, opening databases, creating tables, inserting items, querying and displaying results, and using prepared statements.

## Async Storage

[Async Storage](https://react-native-async-storage.github.io/async-storage/) is an asynchronous, unencrypted, persistent key-value storage for React Native apps. It has a simple API and is a good choice for storing small amounts of data. It is also a good choice for storing data that does not need encryption, such as user preferences or app state.

## Other libraries

There are other libraries available for storing data for different purposes. For example, you might not need encryption in your project or are looking for a faster solution similar to Async Storage.

We recommend checking out [React Native for a list of libraries](https://reactnative.directory/?search=storage) to help you store your project's data.