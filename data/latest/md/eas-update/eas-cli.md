---
title: Manage branches and channels with EAS CLI
sidebar_title: Manage branches and channels
description: Learn how to link a branch to a channel and publish updates with EAS CLI.
---

EAS Update works by linking _branches_ to _channels_. Channels are specified at build time and exist inside a build's native code. Branches are an ordered list of updates, similar to a Git branch, which is an ordered list of commits. With EAS Update, we can link any channel to any branch, allowing us to make different updates available to different builds.

The diagram above visualizes this link. Here, we have the builds with the "production" channel linked to the branch named "version-1.0". When we're ready, we can adjust the channel–branch pointer. Imagine we have more fixes tested and ready on a branch named "version-2.0". We could update this link to make the "version-2.0" branch available to all builds with the "production" channel.

## Inspecting the state of your project's updates

### Inspect channels

View all channels:

View a specific channel:

Create a channel:

### Inspect branches

See all branches:

See a specific branch and a list of its updates:

### Inspect updates

View a specific update:

## Changing the state of your project's updates

### Create a new update and publish it

If you're using Git, we can use the `--auto` flag to auto-fill the branch name and the message. This flag will use the current Git branch as the branch name and the latest Git commit message as the message.

### Delete a branch

### Rename a branch

Renaming branches do not disconnect any channel–branch links. If you had a channel named "production" linked to a branch named "version-1.0", and then you renamed the branch named "version-1.0" to "version-1.0-new", the "production" channel would be linked to the now-renamed branch "version-1.0-new".

### Republish a previous update within a branch

We can make a previous update immediately available to all users. This command takes the previous update and publishes it again so that it becomes the most current update on the branch. As your users re-open their apps, the apps will see the newly re-published update and will download it.

> Republish is similar to a Git reversion, where the correct commit is placed on top of the Git history.

> If you don't know the exact update group ID, you can use the `--branch` flag. This shows a list of the recent updates on the branch and allows you to select the update group to republish.