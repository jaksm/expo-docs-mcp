---
title: Configuration with eas.json
description: Learn about available properties for EAS Build and EAS Submit to configure and override their default behavior from within your project.
maxHeadingDepth: 4
---

**eas.json** is the configuration file for EAS CLI and services. You can find the complete reference of all available schema properties for [EAS Build](/build/introduction) and [EAS Submit](/submit/introduction) on this page.

> **info** To learn more about how a project using EAS services is configured with **eas.json**, see [Configure EAS Build with eas.json](/build/eas-json/) and [Configure EAS Submit with eas.json](/submit/eas-json/).

## EAS Build

The following properties are available in the schema for the `build` key in **eas.json**.

```json eas.json
{
  "build": {
    "base": {
      "node": "12.13.0",
      "yarn": "1.22.5",
      "env": {
        "EXAMPLE_ENV": "example value"
      },
      "android": {
        "image": "default",
        "env": {
          "PLATFORM": "android"
        }
      },
      "ios": {
        "image": "latest",
        "env": {
          "PLATFORM": "ios"
        }
      }
    },
    "development": {
      "extends": "base",
      "developmentClient": true,
      "env": {
        "ENVIRONMENT": "development"
      },
      "android": {
        "distribution": "internal",
        "withoutCredentials": true
      },
      "ios": {
        "simulator": true
      }
    },
    "staging": {
      "extends": "base",
      "env": {
        "ENVIRONMENT": "staging"
      },
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "extends": "base",
      "env": {
        "ENVIRONMENT": "production"
      }
    }
  }
}
```

### Common properties for native platforms

### Android-specific options

### iOS-specific options

## EAS Submit

The following properties are available in the schema for the `submit` key in **eas.json**.

```json eas.json
{
  "cli": {
    "version": ">= 0.34.0"
  },
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "../path/to/api-xxx-yyy-zzz.json",
        "track": "internal"
      },
      "ios": {
        "appleId": "john@turtle.com",
        "ascAppId": "1234567890",
        "appleTeamId": "AB12XYZ34S"
      }
    }
  }
}
```

### Android-specific options

### iOS-specific options