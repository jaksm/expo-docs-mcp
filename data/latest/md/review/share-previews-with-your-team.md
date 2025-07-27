---
title: Share previews with your team
description: Share previews of your app with your team by publishing updates on branches.
---

Once you've made changes on a branch, you can share them with your team by publishing an update. This allows you to get feedback on your changes during review.

The following steps will outline a basic flow for publishing a preview of your changes, and then sharing it with your team. For a more comprehensive resource, see the [Preview updates](/eas-update/preview/) guide.

## Publish a preview of your changes

You can publish a preview of your current changes by running the following [EAS CLI](/develop/tools/#eas-cli) command:

This command will publish an update under the current branch name.

## Share with your team

Once the preview is published, you'll see output like this in the terminal window:

Share the **EAS dashboard** link with a reviewer. After opening the link, they can click on the **Preview** button. They will see a QR code that they can scan to open the preview on their device.

## Create previews automatically

You can automatically create previews on every commit with [EAS Workflows](/eas/workflows/get-started/). First, you'll need to [configure your project](/eas/workflows/get-started/#configure-your-project), add a file named **.eas/workflows/publish-preview-update.yml** at the root of your project, then add the following workflow configuration:

```yaml .eas/workflows/publish-preview-update.yml
name: Publish preview update

on:
  push:
    branches: ['*']

jobs:
  publish_preview_update:
    name: Publish preview update
    type: update
    params:
      branch: ${{ github.ref_name || 'test' }}
```

The workflow above will publish an update on every commit to every branch. You can also run this workflow manually with the following EAS CLI command:

Learn more about common patterns with the [workflows examples guide](/eas/workflows/examples).

## Learn more