# What is the app

Gym Diary is a modern way to log your workouts. Created by someone who was tired of noting the weights and reps of each exercise on the iPhone notes.

# Project stack

- Typescript
- Bun runtime
- Tanstack Start
- Tanstack Query
- Tanstack Forms
- PostgresSQL

# APP Authentication

Authentication is managed by [Clerk](https://clerk.com/docs)

### Env requirements

```
# Clerk configuration, get this key from your [Dashboard](dashboard.clerk.com)

VITE_CLERK_PUBLISHABLE_KEY=
```

# Personal info / data collector

The app will request for your data (optional) this data if you want to provide its for a next future where their will be stats and your data will be metrics for the system

- height
- weight
- age

# How to Run the app

```
cd app
bun run dev
```

# How to check database studio

```
cd app
bun drizzle-kit studio
```
