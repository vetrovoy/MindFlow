# MindFlow Mobile - Android Runbook

This document describes how to build and run the MindFlow mobile app on Android.

## Prerequisites

### System Requirements

- **OS:** Windows 10/11, macOS, or Linux
- **Node.js:** >= 22.11.0 (recommended: use nvm or fnm)
- **pnpm:** 10.6.5+
- **Java:** JDK 17 (required for React Native 0.84+)
- **Android Studio:** Latest stable version

### Android Environment Setup

1. **Install Android Studio** from [developer.android.com](https://developer.android.com/studio)

2. **Install Android SDK:**
   - Open Android Studio → Settings → Languages & Frameworks → Android SDK
   - Install Android SDK Platform (API 34 or later)
   - Install Android SDK Build-Tools
   - Install Android Emulator
   - Install Intel x86 Emulator Accelerator (HAXM) on Intel Macs/PCs

3. **Configure ANDROID_HOME:**
   ```bash
   # Windows (PowerShell)
   $env:ANDROID_HOME = "C:\Users\<username>\AppData\Local\Android\Sdk"
   
   # macOS (add to ~/.zshrc or ~/.bash_profile)
   export ANDROID_HOME=$HOME/Library/Android/sdk
   
   # Linux (add to ~/.bashrc)
   export ANDROID_HOME=$HOME/Android/Sdk
   ```

4. **Add platform-tools to PATH:**
   ```bash
   # Windows
   %ANDROID_HOME%\platform-tools
   
   # macOS/Linux
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

5. **Create an Android Virtual Device (AVD):**
   - Open Android Studio → Tools → Device Manager
   - Create a new device (e.g., Pixel 7 with Android 14)

## Quick Start

### 1. Install Dependencies

From the project root (`MindFlow/`):

```bash
pnpm install
```

### 2. Start Metro Bundler

```bash
pnpm mobile:start
```

This starts the Metro development server on `http://localhost:8081`.

### 3. Run on Android

In a new terminal window:

```bash
pnpm mobile:android
```

This command:
- Builds the Android app
- Starts an emulator (if none running)
- Installs and launches MindFlow

## Manual Android Build

### Debug Build

```bash
cd apps/mobile
pnpm android --variant=debug
```

### Release Build

```bash
cd apps/mobile
pnpm android --variant=release
```

### Install on Connected Device

1. Enable USB Debugging on your Android device:
   - Settings → About Phone → Tap "Build Number" 7 times
   - Settings → Developer Options → Enable "USB Debugging"

2. Connect device via USB

3. Run:
   ```bash
   pnpm mobile:android
   ```

## Troubleshooting

### "SDK location not found"

Add `local.properties` in `apps/mobile/android/`:
```properties
sdk.dir=C\:\\Users\\<username>\\AppData\\Local\\Android\\Sdk
```

### "Unable to load script from assets"

Run Metro with reset cache:
```bash
pnpm mobile:start --reset-cache
```

### Build fails with Gradle error

Clean and rebuild:
```bash
cd apps/mobile/android
./gradlew clean
cd ../..
pnpm mobile:android
```

### Emulator is slow

- Enable hardware acceleration (HAXM/Virtualization)
- Use a system image without Google Play (lighter)
- Allocate more RAM to emulator in AVD settings

### Metro bundler not detecting file changes

```bash
pnpm mobile:start --reset-cache
```

### "No bundle URL present"

Delete and rebuild:
```bash
cd apps/mobile/android
./gradlew clean
rm -rf app/build
cd ../..
pnpm mobile:android
```

## Project Structure

```
apps/mobile/
├── android/           # Android native project
│   ├── app/
│   │   ├── build.gradle
│   │   └── src/main/
│   │       ├── AndroidManifest.xml
│   │       └── java/com/mindflow/app/
│   └── build.gradle
├── src/
│   └── components/
│       └── MindFlowBootstrap.tsx
├── App.tsx            # App entry point
├── index.js           # Metro entry point
├── metro.config.js    # Metro configuration
├── babel.config.js    # Babel configuration
└── package.json
```

## Configuration Files

### android/app/build.gradle

Key configurations:
- `namespace "com.mindflowapp.mobile"` - Java package
- `applicationId "com.mindflowapp.mobile"` - App ID for Play Store
- `versionCode 1` - Internal version number
- `versionName "1.0"` - User-visible version

### android/app/src/main/AndroidManifest.xml

Permissions and app configuration:
- `INTERNET` permission (required for Metro)
- App theme and launch configuration

## Next Steps

After verifying Android runs successfully:

1. Test hot reload (edit `App.tsx` and save)
2. Verify Metro bundler connection
3. Check safe area insets on different devices
4. Test on physical device

## Related Documentation

- [iOS Runbook](./README_IOS.md) - Mac-hosted iOS setup guide
- [Library Policy](./README_LIBRARY_POLICY.md) - Dependencies and tooling
