# MindFlow Mobile

React Native mobile application for MindFlow - offline-first task manager for personal project planning.

## Quick Start

### Prerequisites

- Node.js >= 22.11.0
- pnpm >= 10.6.5
- For Android: Android Studio, JDK 17, Android SDK
- For iOS (macOS only): Xcode 15+, CocoaPods

### Installation

```bash
# From project root
pnpm install

# For iOS (macOS only)
cd apps/mobile/ios
pod install
cd ../..
```

### Running the App

```bash
# Start Metro bundler
pnpm mobile:start

# Run on Android
pnpm mobile:android

# Run on iOS (macOS only)
pnpm mobile:ios
```

## Documentation

- **[Android Runbook](./README_ANDROID.md)** - Complete Android setup and troubleshooting
- **[iOS Runbook](./README_IOS.md)** - Mac-hosted iOS setup and troubleshooting
- **[Library Policy](./README_LIBRARY_POLICY.md)** - Dependencies and monorepo integration

## Project Structure

```
apps/mobile/
├── android/           # Android native project
├── ios/               # iOS native project (MindFlow.xcworkspace)
├── src/
│   └── components/
│       └── MindFlowBootstrap.tsx
├── App.tsx            # App entry point
├── index.js           # Metro entry point
├── metro.config.js    # Metro bundler config (monorepo-aware)
├── babel.config.js    # Babel config with path aliases
├── jest.config.js     # Jest test config
├── tsconfig.json      # TypeScript config (extends root)
└── package.json
```

## Available Scripts

```bash
pnpm mobile:start    # Start Metro dev server
pnpm mobile:android  # Run on Android emulator/device
pnpm mobile:ios      # Run on iOS simulator/device
pnpm mobile:lint     # Lint codebase (ESLint + Prettier)
pnpm mobile:test     # Run Jest tests (see Testing section)
pnpm mobile:typecheck # TypeScript type check
```

## Monorepo Integration

This package is part of the MindFlow monorepo and uses shared packages:

- `@mindflow/domain` - Business entities and use-cases
- `@mindflow/data` - Repository layer and persistence
- `@mindflow/ui` - Design tokens and UI contracts
- `@mindflow/copy` - Localization dictionaries (RU/EN)

Path aliases are configured in:
- `tsconfig.json` - TypeScript path mapping
- `babel.config.js` - Runtime module resolution
- `metro.config.js` - Metro watch folders
- `jest.config.js` - Jest module name mapper

## Tech Stack

- **React Native** 0.84.1
- **React** 19.2.3
- **TypeScript** 5.8.3
- **Metro** - JavaScript bundler
- **Jest** - Testing framework
- **react-native-screens** - Native navigation primitives
- **react-native-safe-area-context** - Safe area handling

## App Identifiers

- **Android:** `com.mindflow.mobile`
- **iOS:** `com.mindflow.mobile`
- **Bundle ID:** `com.mindflow.mobile`

## Development

### Hot Reload

- **Android:** Press `R` twice or Cmd/Ctrl + M → Reload
- **iOS:** Press `R` in Simulator

### Debug Menu

- **Android:** Cmd/Ctrl + M
- **iOS:** Cmd + D

### Reset Metro Cache

```bash
pnpm mobile:start --reset-cache
```

## Testing

```bash
# Run tests (requires additional setup for RN 0.84+)
pnpm mobile:test

# Note: React Native 0.84 uses ESM internally which may cause Jest compatibility issues.
# If tests fail, try:
# - Running with --no-cache flag
# - Clearing Jest cache: jest --clearCache
# This is being tracked for resolution in a future update.
```

## Build Variants

### Android

- **Debug:** `pnpm mobile:android`
- **Release:** `pnpm mobile:android --variant=release`

### iOS

- **Debug:** Product → Run in Xcode
- **Release:** Product → Archive in Xcode

## Troubleshooting

See platform-specific guides:
- [Android Troubleshooting](./README_ANDROID.md#troubleshooting)
- [iOS Troubleshooting](./README_IOS.md#troubleshooting)

## License

Private - MindFlow Project
