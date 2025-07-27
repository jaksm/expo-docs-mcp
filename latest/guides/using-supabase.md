---
title: Using Supabase
description: Add a Postgres Database and user authentication to your React Native app with Supabase.
---

[Supabase](https://supabase.com/?utm_source=expo&utm_medium=referral&utm_term=expo-react-native) is a Backend-as-a-Service (BaaS) app development platform that provides hosted backend services such as a Postgres database, user authentication, file storage, edge functions, realtime syncing, and a vector and AI toolkit. It's an open-source alternative to Google's Firebase.

Supabase automatically [generates a REST API](https://supabase.com/docs/guides/api?utm_source=expo&utm_medium=referral&utm_term=expo-react-native) from your database and employs a concept called [row level security (RLS)](https://supabase.com/docs/guides/auth/row-level-security?utm_source=expo&utm_medium=referral&utm_term=expo-react-native) to secure your data, making it possible to directly interact with your database from your React Native application without needing to go through a server!

Supabase provides a TypeScript client library called [`supabase-js`](https://supabase.com/docs/reference/javascript/introduction?utm_source=expo&utm_medium=referral&utm_term=expo-react-native) to interact with the REST API. Alternatively, Supabase also exposes a [GraphQL API](https://supabase.com/docs/guides/database/extensions/pg_graphql?utm_source=expo&utm_medium=referral&utm_term=expo-react-native) allowing you to use your favorite GraphQL client (for example, [Apollo Client](https://supabase.github.io/pg_graphql/usage_with_apollo/)) should you wish to.

## Prerequisites

Head over to [database.new](https://database.new?utm_source=expo&utm_medium=referral&utm_term=expo-react-native) to create a new Supabase project.

### Get the API Keys

Get the Project URL and `anon` key from the API settings.

1. Go to the [API Settings](https://supabase.com/dashboard/project/_/settings/api) page in the Dashboard.
1. Find your Project `URL`, `anon`, and `service_role` keys on this page.

## Using the Supabase TypeScript SDK

Using [`supabase-js`](https://supabase.com/docs/reference/javascript/introduction?utm_source=expo&utm_medium=referral&utm_term=expo-react-native) is the most convenient way of leveraging the full power of the Supabase stack as it conveniently combines all the different services (database, auth, realtime, storage, edge functions) together.

### Install and initialize the Supabase TypeScript SDK

After you have created your [Expo project](/get-started/create-a-project/), install `@supabase/supabase-js` and the required dependencies using the following command:

Create a helper file to initialize the Supabase client (`@supabase/supabase-js`). You need the API URL and the `anon` key copied [earlier](#get-the-api-keys). These variables are safe to expose in your Expo app since Supabase has [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security?utm_source=expo&utm_medium=referral&utm_term=expo-react-native) enabled in the Database.

```ts utils/supabase.ts

const supabaseUrl = YOUR_REACT_NATIVE_SUPABASE_URL;
const supabaseAnonKey = YOUR_REACT_NATIVE_SUPABASE_ANON_KEY;

  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

Now you can `import { supabase } from '/utils/supabase'` throughout your application to leverage the full power of Supabase!

## Next steps