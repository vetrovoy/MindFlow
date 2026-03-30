# Mobile Library Policy

This document defines the library and dependency policy for the `apps/mobile` package.

## Baseline

The mobile app is built on top of the **React Native CLI template** (React Native 0.84.1) and serves as the foundation for the MindFlow mobile experience.

## Core Dependencies

### Runtime

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | 19.2.3 | UI framework |
| `react-native` | 0.84.1 | Native runtime |
| `react-native-screens` | ^4.11.1 | Native navigation primitives |
| `react-native-safe-area-context` | ^5.5.2 | Safe area insets |

### Development

| Package | Version | Purpose |
|---------|---------|---------|
| `@react-native-community/cli` | ^20.1.3 | CLI tooling |
| `@react-native/babel-preset` | 0.84.1 | Babel configuration |
| `@react-native/metro-config` | 0.84.1 | Metro bundler config |
| `@react-native/typescript-config` | 0.84.1 | TypeScript baseline |
| `jest` | ^29.7.0 | Testing framework |
| `eslint` | ^9.22.0 | Linting |
| `prettier` | ^3.8.1 | Formatting |
| `babel-plugin-module-resolver` | ^5.0.3 | Path aliases |

## Monorepo Integration

The mobile package is part of a pnpm workspace:

- **Workspace root:** `/` (MindFlow monorepo)
- **Package location:** `apps/mobile`
- **Package manager:** pnpm@10.6.5

### Shared Packages (Future)

The following shared packages are planned for integration:

| Package | Status | Notes |
|---------|--------|-------|
| `@mindflow/domain` | Pending | Business entities and use-cases |
| `@mindflow/data` | Pending | Repository layer and persistence |
| `@mindflow/ui` | Pending | Design tokens and UI contracts |
| `@mindflow/copy` | Pending | Localization dictionaries |

### Path Aliases

TypeScript path aliases are configured in the root `tsconfig.base.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@mindflow/domain": ["packages/domain/src/index.ts"],
      "@mindflow/data": ["packages/data/src/index.ts"],
      "@mindflow/ui": ["packages/ui/src/index.ts"],
      "@mindflow/copy": ["packages/copy/src/index.ts"]
    }
  }
}
```

## Metro Configuration

Metro is configured to resolve workspace packages via `@react-native/metro-config`:

```js
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const config = {
  // Workspace resolution will be added in VET-22
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
```

## Version Policy

- React Native follows the **latest stable LTS** release
- Major version upgrades require updating:
  - `@react-native/*` packages
  - Native iOS and Android configurations
  - Metro and Babel presets
- Node.js requirement: `>= 22.11.0`

## Testing Policy

- Unit tests: Jest with `react-native` preset
- Test files: `__tests__/**/*.test.tsx`
- Coverage: Not enforced at this stage

## Linting & Formatting

- ESLint: `@react-native/eslint-config` (React Native 0.84.1)
- Prettier: Project-wide config at root (`.prettierrc.json`)
- TypeScript: Strict mode via `@react-native/typescript-config`

## Native Dependencies

### iOS

- Managed via CocoaPods (`ios/Podfile`)
- Run `bundle exec pod install` after adding native iOS deps

### Android

- Managed via Gradle (`android/app/build.gradle`)
- Namespace: `com.mindflowapp.mobile`

## Scripts

Root-level canonical scripts:

```sh
pnpm mobile:start    # Start Metro dev server
pnpm mobile:android  # Run on Android emulator/device
pnpm mobile:ios      # Run on iOS simulator/device
pnpm mobile:lint     # Lint mobile codebase
pnpm mobile:test     # Run Jest tests
pnpm mobile:typecheck # TypeScript check
```

## Future Considerations

- Navigation: React Navigation v7 (to be added)
- State management: Zustand (shared with web)
- Offline data: Dexie.js or Realm (evaluation pending)
- Sync: Background fetch + conflict resolution (out of scope for Stage 1)
