---
title: Analyzing JavaScript bundles
description: Learn about improving the production JavaScript bundle size of Expo apps and websites.
---

Bundle performance varies for different platforms. For example, web browsers don't support precompiled bytecode, so the JavaScript bundle size is important for improving startup time and performance. The smaller the bundle, the faster it can be downloaded and parsed.

## Analyzing bundle size with Atlas

> Available only for **SDK 51 and above**.

The libraries used in a project influence the size of the production JavaScript bundle. Starting from **Expo SDK 51**, you can use [Expo Atlas](https://github.com/expo/expo-atlas#readme) to visualize the production bundle and identify which libraries contribute to the bundle size.

### Using Atlas with `npx expo start`

You can use Expo Atlas with the local development server. This method allows Atlas to update whenever you change any code in your project.

Once your app is running using the local development server on Android, iOS, and/or web, you can open Atlas through the [dev tools plugin menu](/debugging/devtools-plugins/#using-a-dev-tools-plugin) using <kbd>shift</kbd> + <kbd>m</kbd>.

#### Changing development mode to production

By default, Expo starts the local development server in [development mode](/workflow/development-mode/#development-mode). Development mode disables some optimizations that are enabled in [production mode](/workflow/development-mode/#production-mode). You can also start the local development server in production mode to get a more accurate representation of the production bundle size:

### Using Atlas with `npx expo export`

You can also use Expo Atlas when generating a production bundle for your app or EAS Update. Atlas generates a **.expo/atlas.jsonl** file during export, which you can share and open without having access to the project.

You can also specify the platforms you want to analyze using the `--platform` option. Atlas will gather the data for the exported platforms only.

### Analyzing transformed modules

Inside Atlas, you can hold <kbd>⌘ Cmd</kbd> and click on a graph node to see the transformed module details. This feature helps you understand how a module is transformed by Babel, which modules it imports, and which modules imported it. This can be used to trace the origin of a module across the dependency graph.

## Analyzing bundle size with source-map-explorer

> Alternative method for **SDK 50 and below**.

If you are using SDK 50 or below, you can use the [`source-map-explorer`](https://www.npmjs.com/package/source-map-explorer) library to visualize and analyze the production JavaScript bundle.

To use source map explorer, run the following command to install it:

Add a script to **package.json** to run it. You might have to adjust the input path depending on the platform or SDK you are using. For brevity, the following example assumes the project is Expo SDK 50 and does not use Expo Router `server` output.

```json package.json
{
  "scripts": {
    "analyze:web": "source-map-explorer 'dist/_expo/static/js/web/*.js' 'dist/_expo/static/js/web/*.js.map'",
    "analyze:ios": "source-map-explorer 'dist/_expo/static/js/ios/*.js' 'dist/_expo/static/js/ios/*.js.map'",
    "analyze:android": "source-map-explorer 'dist/_expo/static/js/android/*.js' 'dist/_expo/static/js/android/*.js.map'"
  }
}
```

If you are using the SDK 50 `server` output for web, then use the following to map web bundles:

Web bundles are output to the **dist/client** subdirectory to prevent exposing server code to the client.

Export your production JavaScript bundle and include the `--source-maps` flag so that the source map explorer can read the source maps. For native apps using Hermes, you can use the `--no-bytecode` option to disable bytecode generation.

This command shows the JavaScript bundle and source map paths in the output. In the next step, you will pass these paths to the source map explorer.

> Avoid publishing source maps to production as they can cause both security issues and performance issues (a browser will download the large maps).

Run the script to analyze your bundle:

On running this command, you might see the following error:

```text
You must provide the URL of lib/mappings.wasm by calling SourceMapConsumer.initialize({ 'lib/mappings.wasm': ... }) before using SourceMapConsumer
```

This is probably due to a [known issue](https://github.com/danvk/source-map-explorer/issues/247) in `source-map-explorer` in Node.js 18 and above. To resolve this, set the environment variable `NODE_OPTIONS=--no-experimental-fetch` before running the analyze script.

You might encounter a warning such as `Unable to map 809/13787 bytes (5.87%)`. This occurs because source maps often exclude bundler runtime definitions (for example, `__d(() => {}, [])`). This value is consistent and not a reason for concern.

## Lighthouse

Lighthouse is a great way to see how fast, accessible, and performant your website is. You can test your project with the **Audit** tab in Chrome, or with the [Lighthouse CLI](https://github.com/GoogleChrome/lighthouse#using-the-node-cli).

After creating a production build with `npx expo export -p web` and serving it (using either `npx serve dist`, or production deployment, or custom server), run Lighthouse with the URL your site is hosted at.

<Terminal
  cmd={[
    '# Install the lighthouse CLI',
    '$ npm install -g lighthouse',
    '',
    '# Run the lighthouse CLI for your site',
    '$ npx lighthouse <url> --view',
  ]}
/>