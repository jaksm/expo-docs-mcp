---
title: Tailwind CSS
description: Learn how to configure and use Tailwind CSS in your Expo project.
---

> **info** Standard Tailwind CSS supports only web platform. For universal support, use a library such as [NativeWind](https://www.nativewind.dev/), which allows creating styled React Native components with Tailwind CSS.

[Tailwind CSS](https://tailwindcss.com/) is a utility-first CSS framework and can be used with Metro for web projects. This guide explains how to configure your Expo project to use the framework.

## Prerequisites

The following files will be modified to set the Tailwind CSS configuration:

Ensure that your project is using Metro for web. You can verify this by checking the `web.bundler` field which is set to `metro` in the **app.json** file.

```json app.json
{
  "expo": {
    "web": {
      /* @info The bundler must be set to metro. */
      "bundler": "metro"
      /* @end */
    }
  }
}
```

## Configuration

Configure Tailwind CSS in your Expo project according to the [Tailwind PostCSS documentation](https://tailwindcss.com/docs/installation/using-postcss).

<Tab label="v3">

<Step label="1">

Install `tailwindcss` and its required peer dependencies. Then, the run initialization command to create **tailwind.config.js** and **post.config.js** files in the root of your project.

</Step>

<Step label="2">

Add paths to all of your template files inside **tailwind.config.js**.

```js tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Ensure this points to your source code
    './app/**/*.{js,tsx,ts,jsx}',
    // If you use a `src` directory, add: './src/**/*.{js,tsx,ts,jsx}'
    // Do the same with `components`, `hooks`, `styles`, or any other top-level directories
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

> If you are using Expo Router, consider using a root **src** directory to simplify this step. Learn more about [top-level src directory](/router/reference/src-directory/).

</Step>

<Step label="3">

Create a **global.css** file in the root of your project and directives for each of Tailwind's layers:

```css global.css
/* This file adds the requisite utility classes for Tailwind to work. */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

</Step>

<Step label="4">

Import the **global.css** file in your **app/\_layout.tsx** (if using Expo Router) or **index.js** file:

<CodeBlocksTable tabs={['app/_layout.tsx', 'index.js']}>

```tsx

```

```tsx
// Import the global.css file in the index.js file:

```

</CodeBlocksTable>

> **info** If you are using [DOM components](/guides/dom-components), add this file import to each module using the `"use dom"` directive since they don't share globals.

</Step>

<Step label="5">

You now start your project and use Tailwind CSS classes in your components.

</Step>

</Tab>

<Tab label="v4">

<Step label="1">

Install `tailwindcss` and its required peer dependencies:

</Step>

<Step label="2">

Add Tailwind to your PostCSS configuration

```js postcss.config.mjs

  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```

</Step>

<Step label="3">

Create a global CSS file that imports Tailwind CSS.

You can choose any name for this file. Using **global.css** is common practice.

```css global.css
@import 'tailwindcss';
```

</Step>

<Step label="4">

Import your CSS file in your **app/\_layout.tsx** (if using Expo Router) or **index.js** file:

<CodeBlocksTable tabs={['app/_layout.tsx', 'index.js']}>

```tsx
// If using Expo Router, import your CSS file in the app/_layout.tsx file

```

```tsx
// Otherwise import your CSS file in the index.js file:

```

</CodeBlocksTable>

> **info** If you are using [DOM components](/guides/dom-components), add this file import to each module using the `"use dom"` directive since they don't share globals.

</Step>

<Step label="5">

You now start your project and use Tailwind CSS classes in your components.

</Step>

</Tab>

## Usage

You can use Tailwind with React DOM elements as-is:

{/* prettier-ignore */}
```tsx app/index.tsx

  return (
    <div className="bg-slate-100 rounded-xl">
      <p className="text-lg font-medium">Welcome to Tailwind</p>
    </div>
  );
}
```

You can use the `{ $$css: true }` syntax to use Tailwind with React Native web elements:

```tsx app/index.tsx

  return (
    
      <Text style={{ $$css: true, _: 'text-lg font-medium' }}>Welcome to Tailwind</Text>
    
  );
}
```

## Tailwind for Android and iOS

Tailwind does not support Android and iOS platforms. You can use a compatibility library such as [NativeWind](https://www.nativewind.dev/) for universal support.

## Alternative for Android and iOS

Alternatively, you can use [DOM components](/guides/dom-components) to render your Tailwind web code in a `WebView` on native.

{/* prettier-ignore */}
```tsx app/index.tsx
'use dom';

// Remember to import the global.css file in each DOM component.

  return (
    <div className="bg-slate-100 rounded-xl">
      <p className="text-lg font-medium">Welcome to Tailwind</p>
    </div>
  );
}
```

## Troubleshooting

If you have a custom `config.cacheStores` in your **metro.config.js**, you need to extend the Expo superclass of `FileStore`:

```js metro.config.js
// Import the Expo superclass which has support for PostCSS.
const { FileStore } = require('@expo/metro-config/file-store');

config.cacheStores = [
  new FileStore({
    root: '/path/to/custom/cache',
  }),
];

module.exports = config;
```

Ensure you don't have CSS disabled in your **metro.config.js**:

```js metro.config.js
/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  // Do not disable CSS support when using Tailwind.
  isCSSEnabled: true,
});
```